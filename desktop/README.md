# 凯哥人工智能桌面应用 - 开发文档

> 基于 Electron + React + Vite 构建的跨平台桌面应用

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [开发模式](#开发模式)
- [热更新配置](#热更新配置)
- [项目结构](#项目结构)
- [常用命令](#常用命令)
- [窗口配置](#窗口配置)
- [故障排除](#故障排除)
- [构建和发布](#构建和发布)

## 🚀 项目概述

这是一个现代化的桌面应用程序，提供智能对话功能。支持跨平台运行（Windows、macOS、Linux），具有完整的热更新开发体验。

### 主要特性

- ✅ 跨平台支持 (Windows, macOS, Linux)
- ✅ 热更新开发环境
- ✅ 现代化UI界面
- ✅ 响应式设计，支持移动端布局
- ✅ 智能对话功能
- ✅ 文件上传和处理
- ✅ 主题切换支持

## 🛠 技术栈

- **Electron**: v23.1.3 - 桌面应用框架
- **React**: 最新版本 - 前端UI框架
- **Vite**: 构建工具和开发服务器
- **Ant Design**: UI组件库
- **TypeScript**: 类型安全的JavaScript

### 开发工具

- **concurrently**: 并发运行多个命令
- **nodemon**: 文件监控和自动重启
- **electron-reload**: Electron热更新
- **electron-builder**: 应用打包工具

## 🏃‍♂️ 快速开始

### 1. 环境要求

- Node.js >= 16.0.0
- npm 或 yarn
- Git

### 2. 安装依赖

```bash
# 安装桌面应用依赖
cd desktop
npm install

# 安装前端依赖 (如果还没安装)
cd ..
npm install
```

### 3. 启动开发环境

```bash
# 方式一：使用热更新脚本 (推荐)
./dev-hot.sh          # macOS/Linux
# 或
dev-hot.bat           # Windows

# 方式二：使用npm命令
npm run dev:hot       # 完整热更新模式
npm run dev:main      # 仅Electron主进程热更新
npm run dev           # 传统开发模式
```

## 🔥 开发模式

### 热更新模式 (推荐)

```bash
npm run dev:hot
```

这个命令会同时启动：
- React开发服务器 (Vite) - 前端热更新
- Electron主进程监控 - 主进程文件变化自动重启

### 分别启动模式

```bash
# 终端1：启动React开发服务器
cd .. && npm run dev

# 终端2：启动Electron并监控主进程
npm run watch:electron
```

### 仅主进程热更新

```bash
npm run dev:main
```

适用于只修改Electron主进程代码的场景。

## ⚡ 热更新配置

### 主进程热更新

在 `src/main.js` 中配置：

```javascript
// 开发环境下启用热更新
if (isDev()) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}
```

### 前端热更新

Vite自动提供前端热更新，配置在父目录的 `vite.config.ts` 中。

### 监控配置

使用 `nodemon` 监控文件变化：

```json
{
  "watch:electron": "nodemon --watch src --exec \"electron .\""
}
```

## 📁 项目结构

```
desktop/
├── src/                    # 源代码
│   ├── main.js            # Electron 主进程
│   ├── preload.js         # 预加载脚本
│   └── utils/             # 工具函数
│       └── env.js         # 环境判断
├── assets/                # 静态资源
│   ├── icon.png          # 应用图标
│   ├── icon.ico          # Windows图标
│   └── icon.icns         # macOS图标
├── dev-hot.sh            # 热更新启动脚本 (Unix)
├── dev-hot.bat           # 热更新启动脚本 (Windows)
├── package.json          # 项目配置
└── README.md             # 此文档
```

## 📝 常用命令

### 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev:hot` | 启动完整热更新环境 |
| `npm run dev:main` | 仅主进程热更新 |
| `npm run watch:electron` | 监控Electron主进程 |
| `npm run watch:react` | 启动React开发服务器 |
| `npm run dev` | 传统开发模式 |

### 构建命令

| 命令 | 描述 |
|------|------|
| `npm run build` | 构建生产版本 |
| `npm run dist` | 打包发布版本 |
| `npm run pack` | 仅打包不发布 |

## 🪟 窗口配置

### 基本窗口设置

```javascript
mainWindow = new BrowserWindow({
    width: 1200,           // 窗口宽度
    height: 800,           // 窗口高度
    minHeight: 600,        // 最小高度
    movable: true,         // 允许拖动窗口
    show: false,           // 初始隐藏窗口
    titleBarStyle: 'default' // 标题栏样式
});
```

### 窗口拖拽支持

为了支持自定义标题栏时的窗口拖拽，可以使用CSS：

```css
.electron-drag {
    -webkit-app-region: drag;
}

.electron-no-drag {
    -webkit-app-region: no-drag;
}
```

### IPC通信

主进程与渲染进程通信：

```javascript
// 主进程 (main.js)
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

// 渲染进程 (通过preload.js)
window.electronAPI.minimizeWindow();
```

## 🐛 故障排除

### 常见问题

#### 1. 窗口无法拖动
**问题**: 窗口标题栏无法拖动
**解决**: 确保 `movable: true` 和正确的 `titleBarStyle` 设置

#### 2. 热更新不工作
**问题**: 修改代码后应用不重启
**解决**: 
- 检查 `electron-reload` 是否正确安装
- 确认 `NODE_ENV=development`
- 验证文件监控路径是否正确

#### 3. 端口冲突
**问题**: React开发服务器启动失败
**解决**: 
- 检查端口5173是否被占用
- 修改Vite配置中的端口设置

#### 4. 依赖安装失败
**问题**: npm install 报错
**解决**:
- 清理缓存: `npm cache clean --force`
- 删除node_modules重新安装
- 检查Node.js版本是否满足要求

### 调试技巧

#### 开启开发者工具

```javascript
// 在开发环境自动打开DevTools
if (isDev()) {
    mainWindow.webContents.openDevTools();
}
```

#### 日志输出

```javascript
// 主进程日志
console.log('Main process log');

// 渲染进程日志 (在DevTools中查看)
console.log('Renderer process log');
```

## 📦 构建和发布

### 本地构建

```bash
# 构建React应用
npm run build:react

# 打包Electron应用
npm run build
```

### 平台特定构建

```bash
# macOS
npm run build -- --mac

# Windows
npm run build -- --win

# Linux
npm run build -- --linux
```

### 构建配置

在 `package.json` 中的 `build` 字段配置：

```json
{
  "build": {
    "appId": "com.kai.openbot",
    "productName": "Kai Open Bot",
    "mac": {
      "icon": "assets/icon.icns",
      "category": "public.app-category.productivity"
    },
    "win": {
      "icon": "assets/icon.ico"
    },
    "linux": {
      "icon": "assets/icon.png"
    }
  }
}
```

## 🤝 开发规范

### 代码风格

- 使用ES6+语法
- 遵循React Hooks最佳实践
- 保持代码简洁和注释清晰

### 文件命名

- 组件文件: PascalCase (e.g., `MyComponent.tsx`)
- 工具文件: camelCase (e.g., `utils.js`)
- 常量文件: UPPER_SNAKE_CASE (e.g., `CONSTANTS.js`)

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

## 📞 支持

如有问题，请：
1. 查看本文档的故障排除部分
2. 检查GitHub Issues
3. 联系开发团队

---

**Happy Coding! 🎉** 