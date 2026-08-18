// PM2 进程配置 —— 仅管理本项目（claude-pay），独立进程名与端口，不影响服务器上其他 PM2 应用。
// 用法：pm2 start ecosystem.config.js --env production
//      pm2 reload claude-pay        （零停机重载）
//      pm2 logs claude-pay          （查看日志）
module.exports = {
  apps: [
    {
      name: "claude-pay",
      // 用项目本地的 next 二进制启动，避免全局 next 版本干扰
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3020 -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      // 环境变量从项目根的 .env 读取（Next 会自动加载），这里只兜底 NODE_ENV
      env: {
        NODE_ENV: "production",
        PORT: "3020",
      },
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
