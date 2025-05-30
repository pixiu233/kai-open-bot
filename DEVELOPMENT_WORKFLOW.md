# React + Electron 开发工作流程

## 🚀 快速开始

您的项目现在已经成功集成了 React 和 Electron！

### 项目架构
```
kai-open-bot/
├── src/                    # React 源码 (Ant Design X + TypeScript)
├── dist/                   # React 构建输出
└── desktop/                # Electron 桌面应用
    ├── src/main.js        # Electron 主进程
    ├── src/preload.js     # 安全预加载脚本
    └── node_modules/electron/  # 手动安装的 Electron v23.1.3
```

## 📋 开发模式

### 方案1: 开发时热重载 (推荐)

**第一个终端 - 启动React开发服务器:**
```bash
# 在项目根目录
npm run dev    # 启动 Vite 开发服务器 (http://localhost:5173)
```

**第二个终端 - 启动Electron:**
```bash
# 在desktop目录
cd desktop
npm run start  # 启动 Electron 桌面应用
```

### 方案2: 构建模式测试

```bash
# 1. 构建React应用 (根目录)
npm run build

# 2. 启动Electron (desktop目录)
cd desktop
npm run start
```

## 🔧 集成原理

### Electron如何加载React
在 `desktop/src/main.js` 中:

```javascript
// 开发模式：加载Vite开发服务器
const startUrl = isDev() 
  ? 'http://localhost:5173'        // React热重载
  : `file://${path.join(__dirname, '../../dist/index.html')}`; // 生产构建

mainWindow.loadURL(startUrl);
```

### IPC通信示例
在React组件中使用Electron API:

```javascript
// 检查是否在Electron环境中
if (window.electronAPI) {
  // 获取应用版本
  const version = await window.electronAPI.getAppVersion();
  
  // 获取平台信息
  const platform = await window.electronAPI.getPlatform();
  
  // 监听菜单事件
  window.electronAPI.onMenuNew(() => {
    console.log('New menu clicked');
  });
}
```

## 🛠️ 可用脚本

### React项目 (根目录)
- `npm run dev` - 启动开发服务器 (Vite)
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果

### Electron项目 (desktop目录)
- `npm run start` - 启动Electron应用
- `npm run dev` - 构建React + 启动Electron
- `npm run build` - 打包桌面应用
- `npm run pack` - 打包但不创建安装程序

## 🎨 开发建议

### 1. React组件开发
```bash
# 在根目录开发React组件
npm run dev
# 浏览器访问: http://localhost:5173
```

### 2. Electron功能测试
```bash
# 先启动React开发服务器
npm run dev

# 然后在新终端启动Electron
cd desktop && npm run start
```

### 3. 桌面特性开发
在 `desktop/src/main.js` 中添加:
- 窗口管理
- 原生菜单
- 系统集成
- 文件操作

## 🔒 安全最佳实践

✅ **已配置的安全特性:**
- `nodeIntegration: false` - 禁用Node.js集成
- `contextIsolation: true` - 启用上下文隔离
- `preload脚本` - 安全的API暴露
- `contextBridge` - 安全的IPC通信

## 📦 打包发布

### 开发构建
```bash
cd desktop
npm run pack  # 创建应用包但不打包安装程序
```

### 生产构建
```bash
cd desktop
npm run build  # 创建dmg/exe安装程序
```

### 支持的平台
- ✅ **macOS** (M1/Intel) - 已测试 ✨
- ✅ **Windows** (x64/arm64)
- ✅ **Linux** (x64/arm64)

## 🐛 常见问题

### Q: Electron启动后显示空白页面
**A:** 检查React是否已构建或开发服务器是否运行

### Q: 开发时修改React代码不生效
**A:** 确保使用开发模式 (npm run dev) 而不是构建模式

### Q: 无法使用window.electronAPI
**A:** 检查preload.js是否正确加载

## 🎯 下一步

1. **添加更多桌面功能** - 文件操作、通知、系统托盘
2. **优化性能** - 代码分割、懒加载
3. **添加自动更新** - electron-updater
4. **CI/CD集成** - 自动构建和发布

您的React + Electron项目现在已经完全就绪！🎉 