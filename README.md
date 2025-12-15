# 🔐 Forkeys

**安全密码管理器 | Secure Password Manager**

<p align="center">
  <img src="icons/icon-192.png" alt="Forkeys Logo" width="96">
</p>

<p align="center">
  <strong>本地优先 · AES-256加密 · 零知识架构</strong>
</p>

<p align="center">
  <a href="#功能特性">功能</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#部署指南">部署</a> •
  <a href="#技术架构">架构</a> •
  <a href="#安全说明">安全</a>
</p>

---

## ✨ 功能特性

### 🔒 安全存储
- **AES-256 加密** - 军事级加密标准保护您的数据
- **本地优先** - 密码数据仅存储在您的设备上
- **零知识架构** - 服务器无法访问您的明文密码

### 📱 跨平台支持
- **PWA 技术** - 添加到桌面，像原生 App 一样使用
- **离线可用** - 首次加载后无需联网
- **响应式设计** - 完美适配手机、平板、桌面

### 🌍 国际化
- **中英双语** - 一键切换语言
- **明暗主题** - 支持深色模式

### 🔧 实用功能
- **7种分类** - 社交、邮箱、金融、购物、工作、服务器、其他
- **智能搜索** - 快速定位密码条目
- **密码生成** - 一键生成16位强密码
- **导入导出** - 加密备份，轻松迁移

### 🆘 密码恢复
- **本地恢复** - 安全问题离线找回（不联网）
- **邮箱恢复** - 忘记问题答案时邮件找回

---

## 📁 项目结构

```
forkeys/
├── index.html          # 主应用 (单文件SPA)
├── i18n.js             # 国际化配置 (中/英)
├── service-worker.js   # PWA 离线缓存
├── manifest.json       # PWA 应用清单
├── server.py           # Flask 后端服务
├── requirements.txt    # Python 依赖
└── icons/
    ├── icon-192.png    # 应用图标 192x192
    └── icon-512.png    # 应用图标 512x512
```

---

## 🚀 快速开始

### 方式一：纯前端使用（推荐）

无需后端，直接用浏览器打开：

```bash
# 克隆项目
git clone https://github.com/your-repo/forkeys.git
cd forkeys

# 直接打开
open index.html  # macOS
# 或者
start index.html  # Windows
```

> 💡 **提示**：纯前端模式下，邮箱恢复功能不可用，但本地安全问题恢复正常。

### 方式二：完整部署（带后端）

```bash
# 1. 克隆项目
git clone https://github.com/your-repo/forkeys.git
cd forkeys

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写您的 SMTP 配置

# 4. 启动服务
python server.py
```

访问 `http://localhost:59999`

---

## 📖 使用指南

### 首次使用

1. **设置主密码** - 建议8位以上，包含大小写、数字、符号
2. **记住主密码** - 这是解锁所有数据的唯一钥匙
3. **配置恢复选项** - 进入设置，配置安全问题和邮箱

### 添加密码

1. 点击右下角 **+** 按钮
2. 填写平台名称、账号、密码
3. 选择分类（可选）
4. 点击 **保存**

### 复制密码

- **方式一**：点击列表项右侧的 📋 图标
- **方式二**：点击条目进入详情，点击密码旁的复制图标

### 密码恢复

**忘记主密码？**

1. 点击登录页 **忘记密码**
2. 回答安全问题 → 显示主密码
3. 如果连问题答案也忘了 → 使用邮箱恢复

---

## 🛠️ 部署指南

### 本地开发

```bash
# 安装依赖
pip install flask flask-cors cryptography

# 启动开发服务器
python server.py
```

### 生产部署 (推荐使用 Nginx + Gunicorn)

**1. 安装 Gunicorn**

```bash
pip install gunicorn
```

**2. 配置 Systemd 服务**

```bash
sudo nano /etc/systemd/system/forkeys.service
```

```ini
[Unit]
Description=Forkeys Password Manager
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/forkeys
ExecStart=/usr/local/bin/gunicorn -w 2 -b 127.0.0.1:59999 server:app
Restart=always

[Install]
WantedBy=multi-user.target
```

**3. 配置 Nginx 反向代理**

```nginx
server {
    listen 443 ssl http2;
    server_name forkeys.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:59999;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**4. 启动服务**

```bash
sudo systemctl daemon-reload
sudo systemctl enable forkeys
sudo systemctl start forkeys
```

### 邮件服务配置

修改 `server.py` 中的 SMTP 配置：

```python
SMTP_CONFIG = {
    "SMTP_SERVER": "smtp.example.com",
    "SMTP_PORT": 465,
    "SENDER_EMAIL": "noreply@example.com",
    "SENDER_PASSWORD": "your-password"
}
```

---

## 🏗️ 技术架构

### 前端

| 技术 | 用途 |
|------|------|
| HTML5 + TailwindCSS | UI 界面 |
| CryptoJS | AES-256 加密 |
| Service Worker | PWA 离线支持 |
| LocalStorage | 本地数据存储 |

### 后端

| 技术 | 用途 |
|------|------|
| Flask | Web 框架 |
| SQLite | 数据库 |
| Fernet | 服务端加密 |
| SMTP | 邮件发送 |

### 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                        用户设备                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  主密码     │───▶│  AES-256    │───▶│ localStorage│     │
│  │  (用户输入) │    │  加密       │    │ (加密数据)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 仅存储安全问题（加密）
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        服务器 (可选)                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Fernet     │───▶│  SQLite     │───▶│  邮件恢复   │     │
│  │  加密       │    │  数据库     │    │  功能       │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 安全说明

### 加密机制

| 层级 | 算法 | 说明 |
|------|------|------|
| 客户端 | AES-256 | 使用主密码加密所有密码数据 |
| 服务端 | Fernet (AES-128-CBC) | 加密存储安全问题和答案 |

### 数据存储位置

| 数据类型 | 存储位置 | 加密方式 |
|----------|----------|----------|
| 密码数据 | 浏览器 LocalStorage | AES-256 (主密码) |
| 安全问题 | 服务器 SQLite | Fernet |
| 主密码 | **不存储** | - |

### 安全最佳实践

1. ✅ 使用强主密码（12位以上，混合字符）
2. ✅ 配置两级恢复选项
3. ✅ 定期导出加密备份
4. ✅ 使用 HTTPS 访问
5. ❌ 不要在公共电脑使用
6. ❌ 不要分享主密码

---

## 🔌 API 文档

### 服务器状态

```http
GET /api/status
```

**响应**：
```json
{
    "status": "online",
    "server": "CYBER VAULT",
    "version": "2.0"
}
```

### 注册恢复信息

```http
POST /api/register
Content-Type: application/json

{
    "email": "user@example.com",
    "question": "我的第一只宠物叫什么？",
    "answer": "小白"
}
```

### 请求恢复邮件

```http
POST /api/send_recovery_email
Content-Type: application/json

{
    "email": "user@example.com"
}
```

---

## ❓ 常见问题

<details>
<summary><strong>忘记主密码怎么办？</strong></summary>

使用"忘记密码"功能，通过安全问题或邮箱恢复。如果两者都未设置，数据将无法恢复。
</details>

<details>
<summary><strong>数据存储在哪里？</strong></summary>

所有密码数据加密后存储在您浏览器的 LocalStorage 中，永远不会发送到服务器。
</details>

<details>
<summary><strong>清除浏览器数据会丢失密码吗？</strong></summary>

是的。清除浏览器数据会删除 LocalStorage，请定期导出备份。
</details>

<details>
<summary><strong>服务器能看到我的密码吗？</strong></summary>

不能。所有加密操作在您的设备上完成，服务器只存储加密后的安全问题（用于邮箱恢复）。
</details>

<details>
<summary><strong>如何添加到手机桌面？</strong></summary>

- **iOS**：Safari → 分享 → 添加到主屏幕
- **Android**：Chrome → 菜单 → 添加到主屏幕
</details>

---

## 📄 开源协议

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<p align="center">
  Made with ❤️ for Privacy
</p>
