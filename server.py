#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CYBER VAULT - Forkeys

"""

import sqlite3
import os
import traceback
import smtplib
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# 📂 基础配置 (从环境变量读取)
# ==========================================
DB_PATH = 'vault_server.db'
SERVER_KEY_FILE = 'server_secret.key'
SERVER_HOST = os.getenv('SERVER_HOST', '127.0.0.1')
SERVER_PORT = int(os.getenv('SERVER_PORT', '59999'))

# ==========================================
# 🔐 服务器端加密配置
# ==========================================
def get_or_create_server_key():
    """获取或创建服务器加密密钥"""
    if os.path.exists(SERVER_KEY_FILE):
        with open(SERVER_KEY_FILE, 'rb') as f:
            return f.read()
    else:
        key = Fernet.generate_key()
        with open(SERVER_KEY_FILE, 'wb') as f:
            f.write(key)
        print(f"[SECURITY] 新服务器密钥已生成: {SERVER_KEY_FILE}")
        print(f"[SECURITY] ⚠️ 请务必备份此文件，丢失将无法解密数据！")
        return key

SERVER_KEY = get_or_create_server_key()
cipher_suite = Fernet(SERVER_KEY)

def encrypt_data(plaintext):
    """加密数据"""
    if not plaintext:
        return ""
    return cipher_suite.encrypt(plaintext.encode()).decode()

def decrypt_data(ciphertext):
    """解密数据"""
    if not ciphertext:
        return ""
    try:
        return cipher_suite.decrypt(ciphertext.encode()).decode()
    except Exception:
        return ciphertext  # 兼容旧的未加密数据

# ==========================================
# 📧 SMTP 邮件配置 (从环境变量读取)
# ==========================================
SMTP_CONFIG = {
    "SMTP_SERVER": os.getenv('SMTP_SERVER', 'smtp.qcloudmail.com'),
    "SMTP_PORT": int(os.getenv('SMTP_PORT', '465')),
    "SENDER_EMAIL": os.getenv('SMTP_SENDER_EMAIL', ''),
    "SENDER_PASSWORD": os.getenv('SMTP_SENDER_PASSWORD', '')
}
# ==========================================

def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """初始化数据库"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # 用户金库表（可选云端备份）
        c.execute('''CREATE TABLE IF NOT EXISTS user_vault (
            id INTEGER PRIMARY KEY, 
            vault_blob TEXT
        )''')
        
        # 用户恢复信息表
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            security_question TEXT,
            security_answer_hash TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        # 初始化金库记录
        c.execute("SELECT COUNT(*) FROM user_vault")
        if c.fetchone()[0] == 0:
            c.execute("INSERT INTO user_vault (id, vault_blob) VALUES (1, '')")
        
        conn.commit()
        conn.close()
        print("[DB] 数据库初始化成功")
    except Exception as e:
        print(f"[DB ERROR] 数据库初始化失败: {e}")

# 启动时初始化数据库
init_db()

def get_file_path(filename):
    """获取文件的绝对路径"""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)

def send_email_internal(to_email, subject, body):
    """发送邮件（内部函数）"""
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = SMTP_CONFIG["SENDER_EMAIL"]
        msg['To'] = to_email
        msg['Subject'] = Header(subject, 'utf-8')
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        server = smtplib.SMTP_SSL(SMTP_CONFIG["SMTP_SERVER"], SMTP_CONFIG["SMTP_PORT"])
        server.login(SMTP_CONFIG["SENDER_EMAIL"], SMTP_CONFIG["SENDER_PASSWORD"])
        server.sendmail(SMTP_CONFIG["SENDER_EMAIL"], [to_email], msg.as_string())
        server.quit()
        print(f"[EMAIL] 邮件发送成功: {to_email}")
        return True, "Email sent"
    except Exception as e:
        traceback.print_exc()
        print(f"[EMAIL ERROR] 邮件发送失败: {e}")
        return False, str(e)

# ==========================================
# 🌐 Web 路由
# ==========================================

@app.route('/')
def home():
    """主页 - 返回应用页面"""
    try:
        return send_file(get_file_path('index.html'), mimetype='text/html')
    except Exception as e:
        return f"<h1>CYBER VAULT Server</h1><p>Status: Online</p><p>Error: {e}</p>"

@app.route('/index.html')
def index():
    """主应用页面"""
    try:
        return send_file(get_file_path('index.html'), mimetype='text/html')
    except Exception as e:
        return jsonify({"error": f"Index page not found: {str(e)}"}), 404

# ==========================================
# 📱 PWA 支持路由
# ==========================================

@app.route('/manifest.json')
def manifest():
    """返回 PWA manifest 文件"""
    try:
        return send_file(get_file_path('manifest.json'), mimetype='application/json')
    except Exception as e:
        return jsonify({"error": f"Manifest not found: {str(e)}"}), 404

@app.route('/service-worker.js')
def service_worker():
    """返回 Service Worker 文件"""
    try:
        return send_file(get_file_path('service-worker.js'), mimetype='application/javascript')
    except Exception as e:
        return jsonify({"error": f"Service Worker not found: {str(e)}"}), 404

@app.route('/i18n.js')
def serve_i18n():
    """返回国际化文件"""
    try:
        return send_file(get_file_path('i18n.js'), mimetype='application/javascript')
    except Exception as e:
        return jsonify({"error": f"i18n.js not found: {str(e)}"}), 404

@app.route('/icons/<filename>')
def serve_icon(filename):
    """返回应用图标"""
    try:
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icons', filename)
        return send_file(icon_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": f"Icon not found: {str(e)}"}), 404

@app.route('/icons/icon-192.png')
def icon_192():
    """返回 192x192 图标"""
    try:
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icons', 'icon-192.png')
        return send_file(icon_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": f"Icon not found: {str(e)}"}), 404

@app.route('/icons/icon-512.png')
def icon_512():
    """返回 512x512 图标"""
    try:
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icons', 'icon-512.png')
        return send_file(icon_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": f"Icon not found: {str(e)}"}), 404

# ==========================================
# 🔧 API 端点
# ==========================================

@app.route('/api/email_test', methods=['POST'])
def test_email():
    """测试邮件发送"""
    data = request.json
    target_email = data.get('email')
    if not target_email:
        return jsonify({"error": "Need email address"}), 400
    
    success, msg = send_email_internal(
        target_email, 
        "【CYBER VAULT】邮件测试 / Email Test", 
        "这是一封测试邮件。\nThis is a test email.\n\n-- CYBER VAULT System"
    )
    if success:
        return jsonify({"status": "success", "message": "Email sent"})
    else:
        return jsonify({"status": "error", "message": msg}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    """注册用户恢复信息（加密存储）"""
    try:
        data = request.json
        email = data.get('email')
        question = data.get('question')
        answer = data.get('answer')
        
        if not email:
            return jsonify({"error": "Email required"}), 400
        
        # 加密存储安全问题和答案
        encrypted_question = encrypt_data(question) if question else ""
        encrypted_answer = encrypt_data(answer) if answer else ""
        
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''INSERT OR REPLACE INTO users 
                     (email, security_question, security_answer_hash) 
                     VALUES (?, ?, ?)''', 
                  (email, encrypted_question, encrypted_answer))
        conn.commit()
        conn.close()
        
        print(f"[REGISTER] 用户注册成功: {email}")
        
        # 发送注册确认邮件（双语）
        subject = "【CYBER VAULT】Registration Success / 注册成功"
        body = f"""=== ENGLISH ===

Hello,

You have successfully registered backup recovery for CYBER VAULT.

Your registered email: {email}
Security question has been securely stored (encrypted).

If you forget your master password, you can request recovery through this email.

⚠️ Security Notice:
- Your data is encrypted on the server
- Keep your security answer safe
- If you did not register, please ignore this email


=== 中文 ===

您好，

您已成功注册 CYBER VAULT 备份恢复功能。

您的注册邮箱: {email}
安全问题已加密存储。

如果您忘记主密码，可以通过此邮箱请求恢复。

⚠️ 安全提示:
- 您的数据已在服务器端加密存储
- 请妥善保管您的安全答案
- 如果这不是您本人的操作，请忽略此邮件

-- CYBER VAULT System
-- Server: forkeys.ykers.top"""
        
        send_email_internal(email, subject, body)
        
        return jsonify({"status": "success"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/send_recovery_email', methods=['POST'])
def send_recovery_email():
    """发送恢复邮件（包含解密后的问题和答案）"""
    try:
        data = request.json
        email = data.get('email')
        if not email:
            return jsonify({"error": "Email required"}), 400

        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT security_question, security_answer_hash FROM users WHERE email = ?", (email,))
        row = c.fetchone()
        conn.close()

        if row:
            # 解密存储的数据
            question = decrypt_data(row['security_question'])
            answer = decrypt_data(row['security_answer_hash']) if row['security_answer_hash'] else '(Not Set / 未设置)'
            
            print(f"[RECOVERY] 发送恢复邮件: {email}")
            
            subject = "【CYBER VAULT】Security Recovery / 安全恢复"
            body = f"""=== ENGLISH ===

Hello,

You requested to recover your vault access.

════════════════════════════════════════════════
Security Question:
{question}

Security Answer:
{answer}
════════════════════════════════════════════════

Use this answer to reset your password in the app.

⚠️ Security Notice:
If you did not request this, please ignore this email.


=== 中文 ===

您好，

您请求恢复金库访问权限。

════════════════════════════════════════════════
安全问题:
{question}

安全答案:
{answer}
════════════════════════════════════════════════

请使用此答案在应用中重置您的密码。

⚠️ 安全提示:
如果这不是您本人的操作，请忽略此邮件。

-- CYBER VAULT System
-- Server: forkeys.ykers.top"""

            success, msg = send_email_internal(email, subject, body)
            
            if success:
                return jsonify({"status": "success", "message": "Recovery email sent"})
            else:
                return jsonify({"status": "error", "message": "Failed to send email", "debug": msg}), 500
        else:
            print(f"[RECOVERY] 邮箱未找到: {email}")
            return jsonify({"status": "error", "message": "Email not found in database"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/vault', methods=['GET', 'POST'])
def handle_vault():
    """处理金库数据（可选云端同步）"""
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        if request.method == 'GET':
            c.execute("SELECT vault_blob FROM user_vault WHERE id=1")
            row = c.fetchone()
            conn.close()
            return jsonify({"vault_blob": row['vault_blob'] if row else ""})
            
        elif request.method == 'POST':
            data = request.json
            new_blob = data.get('vault_blob', '')
            c.execute("UPDATE user_vault SET vault_blob = ? WHERE id=1", (new_blob,))
            conn.commit()
            conn.close()
            return jsonify({"status": "success"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def server_status():
    """服务器状态检查"""
    return jsonify({
        "status": "online",
        "server": "CYBER VAULT",
        "version": "2.0",
        "encryption": "Fernet (AES-128-CBC)",
        "address": f"{SERVER_HOST}:{SERVER_PORT}"
    })

@app.route('/api/config', methods=['GET'])
def get_frontend_config():
    """获取前端配置（非敏感信息）"""
    return jsonify({
        "api_base_url": os.getenv('API_BASE_URL', ''),
        "version": "2.0"
    })


# ==========================================
# 🚀 启动服务器
# ==========================================
if __name__ == '__main__':
    print("=" * 60)
    print("🔐 CYBER VAULT Server v2.0")
    print("=" * 60)
    print(f"[CONFIG] 服务器地址: http://{SERVER_HOST}:{SERVER_PORT}")
    print(f"[CONFIG] 数据库文件: {DB_PATH}")
    print(f"[CONFIG] 加密密钥文件: {SERVER_KEY_FILE}")
    print(f"[CONFIG] 邮件服务器: {SMTP_CONFIG['SMTP_SERVER']}:{SMTP_CONFIG['SMTP_PORT']}")
    print(f"[CONFIG] 发件邮箱: {SMTP_CONFIG['SENDER_EMAIL'] or '(未配置)'}")
    print("=" * 60)
    print("[INFO] 可用端点:")
    print("  - GET  /              主应用页面")
    print("  - GET  /api/status    服务器状态")
    print("  - POST /api/register  注册恢复信息")
    print("  - POST /api/send_recovery_email  发送恢复邮件")
    print("  - GET/POST /api/vault 金库数据同步")
    print("=" * 60)
    
    # 启动服务器
    app.run(host=SERVER_HOST, port=SERVER_PORT, debug=False)

