#!/usr/bin/env bash
# 部署 / 更新脚本 —— 只操作本项目，不触碰服务器上其他项目。
# 首次部署与后续更新都可运行。
set -euo pipefail

cd "$(dirname "$0")/.."   # 切到项目根
echo "==> 项目目录: $(pwd)"

# 0. 前置检查
if [ ! -f .env ]; then
  echo "!! 缺少 .env，请先根据 .env.production.example 创建并填好再运行" >&2
  exit 1
fi

# 1. 拉取最新代码（如用 git 部署；非 git 部署可注释掉）
if [ -d .git ]; then
  echo "==> git pull"
  git pull --ff-only
fi

# 2. 安装依赖（生产，锁定版本）
echo "==> npm ci"
npm ci

# 3. 生成 Prisma Client + 应用数据库迁移（只影响本项目的库）
echo "==> prisma generate & migrate deploy"
npx prisma generate
npx prisma migrate deploy

# 4. 构建
echo "==> next build"
npm run build

# 5. 确保上传目录存在且可写
mkdir -p uploads/payment-proofs logs

# 6. 启动 / 重载 PM2（进程名 claude-pay）
if pm2 describe claude-pay > /dev/null 2>&1; then
  echo "==> pm2 reload claude-pay"
  pm2 reload ecosystem.config.js --update-env
else
  echo "==> pm2 start ecosystem.config.js"
  pm2 start ecosystem.config.js
fi

pm2 save
echo "==> 完成。查看日志: pm2 logs claude-pay"
