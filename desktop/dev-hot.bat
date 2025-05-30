@echo off
chcp 65001 >nul

REM 开发环境热更新启动脚本 (Windows)
REM Development hot reload startup script (Windows)

echo 🚀 启动开发环境...
echo 🚀 Starting development environment...

REM 检查是否在正确的目录
if not exist package.json (
    echo ❌ 请在desktop目录下运行此脚本
    echo ❌ Please run this script in the desktop directory
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist node_modules (
    echo 📦 正在安装依赖...
    echo 📦 Installing dependencies...
    npm install
)

REM 设置环境变量
set NODE_ENV=development

echo 🔥 启动热更新模式...
echo 🔥 Starting hot reload mode...

REM 使用concurrently同时运行多个命令
npm run dev:hot

pause 