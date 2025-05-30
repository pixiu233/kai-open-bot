#!/bin/bash

# 开发环境启动脚本
# Development environment startup script

echo "🚀 正在启动Kai Open Bot桌面应用开发环境..."
echo "🚀 Starting Kai Open Bot Desktop App Development Environment..."

# 设置开发环境变量
export NODE_ENV=development

# 检查是否存在React构建文件
if [ ! -d "../dist" ]; then
    echo "📦 React应用未构建，正在构建..."
    echo "📦 React app not built, building..."
    cd ..
    npm run build
    cd desktop
    echo "✅ React应用构建完成"
    echo "✅ React app build completed"
fi

# 启动Electron应用
echo "🖥️  正在启动Electron应用..."
echo "🖥️  Starting Electron app..."
npm run start 