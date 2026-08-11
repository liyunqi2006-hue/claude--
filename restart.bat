@echo off
echo ========================================
echo Claude 代付平台 - 服务重启脚本
echo ========================================
echo.

echo [1/4] 停止现有 Node.js 进程...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js 进程已停止
) else (
    echo ✓ 没有运行中的 Node.js 进程
)
timeout /t 2 >nul

echo.
echo [2/4] 重新生成 Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ✗ Prisma Client 生成失败
    pause
    exit /b 1
)
echo ✓ Prisma Client 生成成功

echo.
echo [3/4] 清理缓存...
if exist .next rmdir /s /q .next
echo ✓ 缓存已清理

echo.
echo [4/4] 启动开发服务器...
echo ========================================
echo.
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.
echo ========================================
call npm run dev
