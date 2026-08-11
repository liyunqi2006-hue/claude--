# 邮件服务配置指南

邮件通知系统已完全搭建完成，只需配置邮箱即可使用。

## 📧 支持的邮件场景

系统会在以下情况自动发送邮件：

1. **订单确认邮件** - 用户下单后立即发送
2. **支付成功邮件** - 用户完成支付后发送
3. **订单查询验证码** - 用户查询订单时发送 6 位数字验证码
4. **订阅激活链接** - 订单完成后发送 Claude 订阅激活链接
5. **API Key 发送** - API 充值订单完成后发送 API Key
6. **管理员通知** - 新订单通知管理员

---

## 🚀 快速配置

### 选项 1: 使用 Resend（推荐）

**优点**：现代化、开发者友好、免费额度 3000 封/月

1. 注册账号：https://resend.com
2. 获取 API Key
3. 在 `.env` 文件中配置：

```env
SMTP_HOST="smtp.resend.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="resend"
SMTP_PASS="re_your_api_key_here"
SMTP_FROM="noreply@yourdomain.com"
SMTP_FROM_NAME="Claude 代付"
ADMIN_NOTIFY_EMAIL="admin@yourdomain.com"
```

### 选项 2: 使用 Gmail

1. 启用 Gmail 的两步验证
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 配置：

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password-here"
SMTP_FROM="your-email@gmail.com"
SMTP_FROM_NAME="Claude 代付"
ADMIN_NOTIFY_EMAIL="admin@gmail.com"
```

### 选项 3: 使用腾讯企业邮箱

```env
SMTP_HOST="smtp.exmail.qq.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-email-password"
SMTP_FROM="noreply@yourdomain.com"
SMTP_FROM_NAME="Claude 代付"
ADMIN_NOTIFY_EMAIL="admin@yourdomain.com"
```

### 选项 4: 使用阿里云邮件推送

```env
SMTP_HOST="smtpdm.aliyun.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-username@your-domain.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@your-domain.com"
SMTP_FROM_NAME="Claude 代付"
ADMIN_NOTIFY_EMAIL="admin@yourdomain.com"
```

---

## 📋 配置说明

### 必填字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `SMTP_HOST` | SMTP 服务器地址 | `smtp.resend.com` |
| `SMTP_PORT` | SMTP 端口 | `465` (SSL) 或 `587` (TLS) |
| `SMTP_SECURE` | 是否使用 SSL | `true` (465端口) / `false` (587端口) |
| `SMTP_USER` | SMTP 用户名 | 通常是邮箱地址或 API Key |
| `SMTP_PASS` | SMTP 密码 | 邮箱密码或应用专用密码 |
| `SMTP_FROM` | 发件人邮箱 | `noreply@yourdomain.com` |
| `SMTP_FROM_NAME` | 发件人名称 | `Claude 代付` |

### 可选字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `ADMIN_NOTIFY_EMAIL` | 管理员通知邮箱（接收新订单通知） | `admin@yourdomain.com` |

---

## ✅ 测试邮件配置

配置完成后，重启服务并测试：

### 方法 1: 通过管理后台测试

1. 登录管理后台
2. 访问 `/api/admin/test-email`
3. 系统会发送测试邮件

### 方法 2: 使用 curl 测试

```bash
# 检查配置状态
curl http://localhost:3000/api/admin/test-email

# 发送测试邮件（需要管理员登录）
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

---

## 🔍 故障排查

### 邮件发送失败

1. **检查配置**：确保所有环境变量正确填写
2. **检查端口**：
   - 465 端口使用 `SMTP_SECURE="true"`
   - 587 端口使用 `SMTP_SECURE="false"`
3. **检查密码**：某些邮箱服务需要使用"应用专用密码"而不是登录密码
4. **检查防火墙**：确保服务器可以访问 SMTP 端口

### Gmail 特定问题

- 必须启用两步验证
- 必须使用应用专用密码，不能使用账号密码
- 可能需要启用"不够安全的应用的访问权限"（不推荐）

### 企业邮箱问题

- 确认 SMTP 服务已启用
- 检查是否需要在邮箱管理后台开启 SMTP 权限
- 某些企业邮箱可能有 IP 白名单限制

---

## 📊 邮件模板预览

所有邮件模板已内置，采用响应式设计，支持深色模式，包含：

- ✅ 品牌化的邮件头部
- ✅ 清晰的内容布局
- ✅ 明显的 CTA 按钮
- ✅ 安全提示和注意事项
- ✅ 中英文双语支持

---

## 🎯 下一步

配置完成后，系统会自动在合适的时机发送邮件：

1. 用户下单 → **订单确认邮件** + **管理员通知**
2. 用户支付 → **支付成功邮件**
3. 管理员发货 → **激活链接邮件** 或 **API Key 邮件**
4. 用户查询订单 → **验证码邮件**

无需任何额外代码，一切都已自动化！

---

## 💡 提示

- 推荐使用 Resend 或专业的 SMTP 服务，避免邮件被标记为垃圾邮件
- 如果使用自定义域名，建议配置 SPF、DKIM、DMARC 记录
- 测试时先发送到自己的邮箱，确认样式和内容正确
- 生产环境建议监控邮件发送成功率

---

**需要帮助？** 检查控制台日志中的错误信息，或查看 Nodemailer 官方文档。
