#!/bin/bash

# 开发环境热更新启动脚本
# Development hot reload startup script

echo "🚀 启动开发环境..."
echo "🚀 Starting development environment..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在desktop目录下运行此脚本"
    echo "❌ Please run this script in the desktop directory"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    echo "📦 Installing dependencies..."
    npm install
fi

# 设置环境变量
export NODE_ENV=development

echo "🔥 启动热更新模式..."
echo "🔥 Starting hot reload mode..."

# 使用concurrently同时运行多个命令
# 1. 在父目录启动React开发服务器 (Vite)
# 2. 使用nodemon监控Electron主进程文件变化
npm run dev:hot 