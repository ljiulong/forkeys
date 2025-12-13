/**
 * Forkeys - 国际化配置
 * 支持中文和英文
 */
const i18n = {
    zh: {
        // 应用信息
        appName: "Forkeys",
        appSlogan: "安全密码管理",
        
        // 初始化
        sysInit: "初始化金库",
        initConfig: "设置您的主密码",
        setMasterPass: "输入主密码",
        confirmPass: "确认主密码",
        executeSetup: "创建金库",
        setupTip: "请设置一个强密码，建议包含大小写字母、数字和特殊字符",
        
        // 登录
        accessControl: "金库已锁定",
        securedBy: "AES-256 加密保护",
        enterPasscode: "输入密码",
        unlockTerminal: "解锁金库",
        accessDenied: "密码错误",
        forgotPass: "忘记密码？",
        
        // 搜索和筛选
        searchPlaceholder: "搜索...",
        catAll: "全部",
        catSocial: "社交",
        catEmail: "邮箱",
        catFinance: "金融",
        catShopping: "购物",
        catWork: "工作",
        catServer: "服务器",
        catOther: "其他",
        sortNewest: "最新",
        sortOldest: "最早",
        sortName: "名称",
        
        // 条目
        newEntry: "新增",
        viewEntry: "查看详情",
        editEntry: "编辑",
        targetLabel: "平台",
        userIdLabel: "账号",
        secretLabel: "密码",
        metaLabel: "备注",
        categoryLabel: "分类",
        saveData: "保存",
        markAsHidden: "标记为隐藏",
        emptyDb: "暂无数据",
        confirmDelete: "确定删除？",
        copied: "已复制",
        dataSaved: "保存成功",
        
        // 设置
        secTitle: "设置",
        localRecovery: "本地恢复",
        localRecoveryDesc: "设置安全问题用于本地密码恢复。答案会用于加密您的主密码，因此请牢记答案。",
        offlineTag: "离线",
        saveLocal: "保存安全问题",
        secQuestionPlaceholder: "设置安全问题（如：我的第一只宠物叫什么？）",
        answerPlaceholder: "您的答案",
        serverRecovery: "服务器恢复",
        serverRecoveryDesc: "注册邮箱后，如果同时忘记密码和安全问题答案，可以通过邮箱找回。服务器会加密存储您的安全问题。",
        onlineTag: "在线",
        connectRegister: "连接并注册",
        emailPlaceholder: "您的邮箱地址",
        changePassword: "修改密码",
        changePasswordDesc: "修改主密码后，所有数据将使用新密码重新加密。请确保新密码足够安全。",
        currentPasswordPlaceholder: "当前密码",
        newPasswordPlaceholder: "新密码",
        confirmNewPasswordPlaceholder: "确认新密码",
        updatePassword: "更新密码",
        passwordChanged: "密码已更新",
        dataBackup: "数据备份",
        dataBackupDesc: "导出的文件包含加密后的密码数据，可用于备份或迁移到其他设备。导入时需要输入原密码验证。",
        exportData: "导出数据",
        importData: "导入数据",
        importModeMerge: "合并",
        importModeReplace: "替换",
        dangerZone: "危险区域",
        dangerZoneDesc: "此操作不可撤销，将永久删除所有保存的密码数据。",
        deleteAllData: "删除所有数据",
        deleteAllConfirm: "确定删除所有数据？输入 DELETE 确认：",
        
        // 密码恢复
        recoveryMode: "密码恢复",
        recoveryPrompt: "请回答安全问题：",
        verifyRecover: "验证身份",
        invalidAnswer: "答案错误",
        forgotQuestion: "使用邮箱恢复",
        manualProtocol: "邮箱恢复",
        protocolDescNew: "输入注册邮箱，服务器会将安全问题和答案发送到该邮箱。",
        requestQuestion: "发送请求",
        backToRecovery: "返回",
        emailSent: "已发送",
        recoveryNotSet: "未设置恢复选项",
        
        // 错误提示
        passNull: "请输入密码",
        passShort: "密码太短（至少4位）",
        passMismatch: "两次密码不匹配",
        titleNull: "请输入平台名称",
        exportSuccess: "导出成功",
        importSuccess: "导入成功",
        serverError: "服务器连接失败",
        emailInvalid: "邮箱格式错误",
        questionSaved: "安全问题已保存",
        currentPasswordWrong: "当前密码错误",
        
        // 使用手册
        helpTitle: "使用手册",
        helpQuickStart: "快速开始",
        helpQuickStartContent: `欢迎使用 Forkeys！

【首次使用】
• 设置主密码（建议8位以上）
• 主密码是唯一钥匙，请务必牢记

【添加密码】
• 点击右下角 + 按钮
• 填写平台、账号、密码
• 选择分类，点击保存

【查看复制】
• 点击列表项查看详情
• 点击眼睛图标显示密码
• 点击复制图标一键复制`,
        
        helpSecurity: "安全机制",
        helpSecurityContent: `Forkeys 采用银行级安全标准：

【加密技术】
• AES-256 军事级加密算法
• 所有数据本地加密存储
• 零知识架构，我们无法访问

【数据存储】
• 密码仅存储在您的设备
• 主密码不会上传服务器
• 无主密码无法解密数据

【服务器用途】
• 仅存储加密的安全问题
• 用于密码恢复功能
• 不存储任何明文密码`,
        
        helpRecovery: "密码恢复",
        helpRecoveryContent: `忘记主密码？两级恢复机制：

【第一级：本地恢复】
• 设置 → 配置安全问题
• 忘记密码时回答问题找回
• 离线可用，无需联网

【第二级：邮箱恢复】
• 设置 → 注册邮箱
• 连安全问题也忘了时使用
• 需要联网，邮件找回

【重要提示】
⚠️ 建议同时设置两种恢复方式
⚠️ 未设置恢复 = 忘记密码无法找回
⚠️ 定期导出备份最安全`,
        
        helpTips: "使用技巧",
        helpTipsContent: `掌握这些技巧更高效：

【密码生成】
• 点击骰子图标生成16位强密码
• 包含大小写、数字、特殊符号

【隐藏功能】
• 勾选"标记为隐藏"隐藏敏感条目
• 点击眼睛图标切换显示隐藏项

【分类管理】
• 7种分类便于管理
• 筛选器快速定位

【数据备份】
• 定期导出 JSON 备份
• 备份已加密，需原密码导入`,
        
        helpFAQ: "常见问题",
        helpFAQContent: `Q: 忘记主密码怎么办？
A: 使用"忘记密码"功能，通过安全问题或邮箱恢复。

Q: 数据存储在哪里？
A: 所有数据加密后存储在您设备的浏览器本地存储中。

Q: 换手机/电脑怎么迁移？
A: 导出备份文件，在新设备导入即可。

Q: 清除浏览器数据会丢失密码吗？
A: 是的，清除会删除所有数据。请定期导出备份。

Q: PWA 模式是什么？
A: 可以将网页添加到桌面像 App 一样使用，支持离线访问。

Q: 服务器会看到我的密码吗？
A: 不会。所有加密在您设备完成，服务器仅存储加密数据。

Q: 支持多设备同步吗？
A: 目前需手动导出/导入同步，建议用云盘存储备份文件。`,
        
        helpClose: "我知道了",
        aboutVersion: "版本",
        aboutCopyright: "安全存储您的数字资产"
    },
    
    en: {
        // App info
        appName: "Forkeys",
        appSlogan: "Secure Password Manager",
        
        // Setup
        sysInit: "Initialize Vault",
        initConfig: "Set your master password",
        setMasterPass: "Master Password",
        confirmPass: "Confirm Password",
        executeSetup: "Create Vault",
        setupTip: "Use a strong password with uppercase, lowercase, numbers and symbols",
        
        // Login
        accessControl: "Vault Locked",
        securedBy: "AES-256 Encrypted",
        enterPasscode: "Enter Password",
        unlockTerminal: "Unlock Vault",
        accessDenied: "Wrong Password",
        forgotPass: "Forgot Password?",
        
        // Search and filter
        searchPlaceholder: "Search...",
        catAll: "All",
        catSocial: "Social",
        catEmail: "Email",
        catFinance: "Finance",
        catShopping: "Shopping",
        catWork: "Work",
        catServer: "Server",
        catOther: "Other",
        sortNewest: "Newest",
        sortOldest: "Oldest",
        sortName: "Name",
        
        // Entry
        newEntry: "Add New",
        viewEntry: "View Details",
        editEntry: "Edit",
        targetLabel: "Platform",
        userIdLabel: "Account",
        secretLabel: "Password",
        metaLabel: "Notes",
        categoryLabel: "Category",
        saveData: "Save",
        markAsHidden: "Mark as Hidden",
        emptyDb: "No Data",
        confirmDelete: "Confirm Delete?",
        copied: "Copied",
        dataSaved: "Saved",
        
        // Settings
        secTitle: "Settings",
        localRecovery: "Local Recovery",
        localRecoveryDesc: "Set a security question for local password recovery. The answer encrypts your master password.",
        offlineTag: "Offline",
        saveLocal: "Save Security Question",
        secQuestionPlaceholder: "Security question (e.g., What was my first pet's name?)",
        answerPlaceholder: "Your answer",
        serverRecovery: "Server Recovery",
        serverRecoveryDesc: "Register your email. If you forget both password and security answer, recover via email.",
        onlineTag: "Online",
        connectRegister: "Connect & Register",
        emailPlaceholder: "Your email address",
        changePassword: "Change Password",
        changePasswordDesc: "All data will be re-encrypted with the new password.",
        currentPasswordPlaceholder: "Current Password",
        newPasswordPlaceholder: "New Password",
        confirmNewPasswordPlaceholder: "Confirm New Password",
        updatePassword: "Update Password",
        passwordChanged: "Password Updated",
        dataBackup: "Data Backup",
        dataBackupDesc: "Exported file contains encrypted password data for backup or migration.",
        exportData: "Export",
        importData: "Import",
        importModeMerge: "Merge",
        importModeReplace: "Replace",
        dangerZone: "Danger Zone",
        dangerZoneDesc: "This action is irreversible. All saved passwords will be permanently deleted.",
        deleteAllData: "Delete All Data",
        deleteAllConfirm: "Delete all data? Type DELETE to confirm:",
        
        // Recovery
        recoveryMode: "Password Recovery",
        recoveryPrompt: "Answer Security Question:",
        verifyRecover: "Verify",
        invalidAnswer: "Wrong Answer",
        forgotQuestion: "Use Email Recovery",
        manualProtocol: "Email Recovery",
        protocolDescNew: "Enter registered email to receive your security question and answer.",
        requestQuestion: "Send Request",
        backToRecovery: "Back",
        emailSent: "Sent",
        recoveryNotSet: "Recovery not set",
        
        // Errors
        passNull: "Password required",
        passShort: "Password too short (min 4)",
        passMismatch: "Passwords don't match",
        titleNull: "Platform name required",
        exportSuccess: "Exported",
        importSuccess: "Imported",
        serverError: "Server connection failed",
        emailInvalid: "Invalid email",
        questionSaved: "Question Saved",
        currentPasswordWrong: "Wrong current password",
        
        // Help
        helpTitle: "User Guide",
        helpQuickStart: "Quick Start",
        helpQuickStartContent: `Welcome to Forkeys!

【First Time】
• Set master password (8+ chars recommended)
• This is your only key - remember it!

【Adding Passwords】
• Tap + button at bottom right
• Fill platform, account, password
• Choose category, tap Save

【View & Copy】
• Tap list item to view details
• Tap eye icon to show password
• Tap copy icon to copy`,
        
        helpSecurity: "Security",
        helpSecurityContent: `Bank-grade security standards:

【Encryption】
• AES-256 military-grade encryption
• All data encrypted locally
• Zero-knowledge architecture

【Data Storage】
• Passwords stored only on your device
• Master password never uploaded
• No decryption without password

【Server Purpose】
• Only stores encrypted security questions
• Used for password recovery
• No plaintext passwords stored`,
        
        helpRecovery: "Password Recovery",
        helpRecoveryContent: `Forgot master password? Two-level recovery:

【Level 1: Local Recovery】
• Settings → Configure security question
• Answer question to recover password
• Works offline

【Level 2: Email Recovery】
• Settings → Register email
• Use when you forget the question too
• Requires internet

【Important】
⚠️ Set up BOTH recovery methods
⚠️ No recovery setup = lost data if forgotten
⚠️ Regular backups are safest`,
        
        helpTips: "Tips & Tricks",
        helpTipsContent: `Be more efficient:

【Password Generator】
• Tap dice icon for 16-char strong password
• Includes mixed case, numbers, symbols

【Hidden Items】
• Check "Mark as Hidden" to hide sensitive items
• Tap eye icon to toggle visibility

【Categories】
• 7 categories for easy management
• Use filters to find quickly

【Backups】
• Export JSON backup regularly
• Encrypted backup needs original password`,
        
        helpFAQ: "FAQ",
        helpFAQContent: `Q: Forgot master password?
A: Use "Forgot Password" to recover via security question or email.

Q: Where is data stored?
A: Encrypted in your browser's local storage on your device.

Q: How to migrate to new device?
A: Export backup file, import on new device.

Q: Will clearing browser data delete passwords?
A: Yes. Please backup regularly.

Q: What is PWA mode?
A: Add to home screen to use like an app, works offline.

Q: Can server see my passwords?
A: No. All encryption happens on your device.

Q: Multi-device sync?
A: Manual export/import for now. Store backups in cloud storage.`,
        
        helpClose: "Got it",
        aboutVersion: "Version",
        aboutCopyright: "Securely store your digital assets"
    }
};

// 导出给 HTML 使用
if (typeof window !== 'undefined') {
    window.i18n = i18n;
}
