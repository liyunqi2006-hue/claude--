# 部署到 df.ponr.org（Nginx + PM2 + 已有 PostgreSQL）

本项目为 **Next.js 16 常驻服务**（非静态站）。以下步骤全部使用**独立端口 / 独立进程 / 独立数据库 / 独立 vhost**，不会影响服务器上其他项目。

- 监听端口：`127.0.0.1:3020`（仅本机，由 Nginx 对外）
- PM2 进程名：`claude-pay`
- 数据库：为本项目单独新建 `claudepay` 库与账号
- 域名：`df.ponr.org`

---

## 1. 上传代码到服务器
把项目放到独立目录，例如 `/var/www/claude-pay`（勿覆盖其他项目目录）。用 git 或 rsync 均可。

## 2. 新建独立数据库（不碰其他项目的库）
```bash
sudo -u postgres psql <<'SQL'
CREATE USER claudepay WITH PASSWORD '换成强密码';
CREATE DATABASE claudepay OWNER claudepay;
SQL
```

## 3. 配置环境变量
```bash
cd /var/www/claude-pay
cp .env.production.example .env
# 编辑 .env：填 DATABASE_URL、AUTH_SECRET、CRYPTO_KEY、SMTP_PASS(QQ授权码) 等
# 生成密钥：
openssl rand -base64 32   # 用作 AUTH_SECRET
openssl rand -base64 32   # 用作 CRYPTO_KEY
```
> `DATABASE_URL` 指向第 2 步新建的库，例：
> `postgresql://claudepay:强密码@127.0.0.1:5432/claudepay?schema=public`

## 4. 一键部署
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```
该脚本会：`npm ci` → `prisma generate` → `prisma migrate deploy`（只建本项目的表）→ `next build` → 用 PM2 以 `claude-pay` 启动/重载。

（可选）首次跑数据库种子：
```bash
npm run db:seed
```

## 5. 配置 Nginx（只加一个 vhost）
```bash
sudo cp deploy/nginx-df.ponr.org.conf /etc/nginx/sites-available/df.ponr.org.conf
sudo ln -s /etc/nginx/sites-available/df.ponr.org.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
> 若你的 Nginx 用 `conf.d/` 而非 `sites-enabled/`，把文件放到 `/etc/nginx/conf.d/df.ponr.org.conf` 即可。

## 6. 申请 HTTPS 证书
先把 `df.ponr.org` 的 DNS A 记录指向服务器公网 IP，然后：
```bash
sudo certbot --nginx -d df.ponr.org
```
certbot 会自动补 443 配置并加 80→443 跳转。

## 7. 开机自启
```bash
pm2 startup      # 按提示执行它输出的那条命令
pm2 save
```

---

## 后续更新
```bash
cd /var/www/claude-pay
./deploy/deploy.sh     # git pull + 迁移 + 构建 + pm2 reload（零停机）
```

## 常用运维
```bash
pm2 logs claude-pay        # 日志
pm2 restart claude-pay     # 重启
pm2 stop claude-pay        # 停止（不影响其他 PM2 应用）
pm2 list                   # 查看所有进程，确认没干扰别人
```

## 隔离性checklist（确认不影响其他项目）
- [ ] 端口 3020 未被占用：`ss -ltnp | grep 3020`
- [ ] PM2 里进程名唯一：`pm2 list` 中只有你新增的 `claude-pay`
- [ ] 数据库是新建的 `claudepay`，未动其他库
- [ ] Nginx 只新增了 `df.ponr.org.conf`，`nginx -t` 通过
- [ ] `uploads/payment-proofs`、`logs` 目录可写（付款截图/日志）
