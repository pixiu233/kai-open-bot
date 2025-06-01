# 📝 全局文字选择工具

## 🎯 功能概述

这是一个强大的全局文字选择工具，当您在电脑上的任何地方选中文字并复制时，会自动在选中位置上方显示一个功能面板，提供翻译、解释、搜索、朗读等便捷操作。

## ✨ 主要特性

### 🔄 自动检测
- 监听全局 `Ctrl+C` 复制操作
- 自动检测剪贴板中的新文字内容
- 智能去重，避免重复显示相同内容

### 🎨 悬浮面板
- 美观的半透明悬浮面板
- 自动定位在鼠标位置附近
- 3秒后自动消失或失去焦点时关闭

### 🛠️ 功能按钮
- **🌐 翻译**: 将选中文字发送到主窗口进行翻译
- **📖 解释**: 将选中文字发送到主窗口进行AI解释
- **🔍 搜索**: 在默认浏览器中搜索选中文字
- **🔊 朗读**: 使用语音合成技术朗读选中文字

## 🚀 使用方法

### 基本操作
1. 在任何应用程序中选中您想要处理的文字
2. 按 `Ctrl+C` 复制文字
3. 悬浮面板会自动出现在鼠标位置附近
4. 点击相应的功能按钮执行操作

### 功能详解

#### 翻译功能 🌐
- 点击翻译按钮后，主窗口会激活并显示
- 选中的文字会传递给翻译处理器
- 可以集成各种翻译API（如Google翻译、百度翻译等）

#### 解释功能 📖
- 点击解释按钮后，主窗口会激活并显示
- 选中的文字会传递给AI解释处理器
- 可以集成AI模型进行智能解释

#### 搜索功能 🔍
- 直接在默认浏览器中打开Google搜索
- 自动编码特殊字符
- 支持中英文搜索

#### 朗读功能 🔊
- 使用浏览器内置的语音合成API
- 支持中文朗读，语速适中
- 实时反馈朗读状态

## ⚙️ 技术实现

### 后端 (Electron主进程)
```javascript
// 全局键盘监听
const { GlobalKeyboardListener } = require('node-global-key-listener');

// 剪贴板操作
const clipboardy = require('clipboardy');

// 创建悬浮窗口
const overlayWindow = new BrowserWindow({
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true
});
```

### 前端 (React)
```typescript
// 全局文字操作Hook
import { useGlobalTextActions } from './hooks/useGlobalTextActions';

// 在App组件中使用
useGlobalTextActions(
  onTranslate,  // 翻译处理函数
  onExplain,    // 解释处理函数
  onSpeak       // 朗读处理函数（可选）
);
```

## 🔧 自定义配置

### 修改悬浮面板样式
编辑 `desktop/src/utils/textSelection.js` 中的 `generateOverlayHTML` 方法：

```javascript
// 修改面板外观
body {
  background: rgba(0, 0, 0, 0.8);  // 背景颜色
  border-radius: 8px;              // 圆角大小
  backdrop-filter: blur(10px);     // 背景模糊
}

// 修改按钮样式
.btn {
  background: rgba(255, 255, 255, 0.2);  // 按钮背景
  color: white;                           // 文字颜色
}
```

### 自定义功能处理
在 `src/App.tsx` 中修改 `useGlobalTextActions` 的参数：

```typescript
useGlobalTextActions(
  // 自定义翻译处理
  (text: string) => {
    // 您的翻译逻辑
    callTranslationAPI(text);
  },
  // 自定义解释处理
  (text: string) => {
    // 您的解释逻辑
    callAIExplanationAPI(text);
  },
  // 自定义朗读处理
  (text: string) => {
    // 您的朗读逻辑
    customSpeechFunction(text);
  }
);
```

## 🛡️ 安全与隐私

### 数据处理
- 所有文字内容仅在本地处理
- 不会自动上传任何内容到外部服务器
- 用户主动点击功能按钮时才会调用相应的API

### 权限要求
- 需要全局键盘监听权限
- 需要剪贴板读取权限
- 需要创建悬浮窗口权限

## 🐛 故障排除

### 常见问题

1. **悬浮面板不显示**
   - 检查是否正确复制了文字
   - 确认全局键盘监听已启动
   - 查看控制台是否有错误信息

2. **功能按钮无响应**
   - 检查主窗口是否正常运行
   - 确认IPC通信是否正常
   - 查看网络连接（如果使用在线API）

3. **语音朗读不工作**
   - 确认浏览器支持Speech Synthesis API
   - 检查系统音频设置
   - 尝试其他文字内容

### 调试模式
启用开发者工具查看详细日志：
```javascript
// 在开发环境下会自动打开DevTools
if (isDev()) {
  mainWindow.webContents.openDevTools();
}
```

## 📈 未来规划

### 即将推出的功能
- [ ] 支持更多语言的语音合成
- [ ] 添加OCR文字识别（从图片中提取文字）
- [ ] 集成更多翻译服务提供商
- [ ] 支持自定义快捷键
- [ ] 添加文字历史记录
- [ ] 支持批量文字处理

### 性能优化
- [ ] 减少内存占用
- [ ] 优化悬浮窗口动画
- [ ] 改进响应速度
- [ ] 增强稳定性

## 💡 贡献指南

欢迎提交功能建议和bug报告！请在项目GitHub页面创建Issue或Pull Request。

---

**最后更新**: 2025年1月
**版本**: v1.0.0 