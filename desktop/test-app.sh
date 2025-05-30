#!/bin/bash

echo "🧪 快速测试凯哥人工智能桌面应用"
echo "================================"

# 检查应用是否存在
if [ ! -d "dist/mac-arm64/凯哥人工智能.app" ]; then
    echo "❌ 应用不存在，正在构建..."
    npm run build:arm64
else
    echo "✅ 应用已存在"
fi

echo "🚀 启动应用..."
open "dist/mac-arm64/凯哥人工智能.app"

echo "📝 如果界面显示空白，请检查控制台错误信息"
echo "💡 可以在应用中按 Cmd+Option+I 打开开发者工具" 