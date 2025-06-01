// 设置进程编码
if (process.platform === 'win32') {
    process.env.LANG = 'zh_CN.UTF-8';
    // Windows下不使用 setEncoding
} else {
    process.stdout.setEncoding('utf8');
    process.stderr.setEncoding('utf8');
}

const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const { isDev } = require('./utils/env');
const TextSelectionHandler = require('./utils/textSelection');

// 开发环境下启用热更新
if (isDev()) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}

// Keep a global reference of the window object
let mainWindow;
let textSelectionHandler;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 356,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '../assets/icon.png'),
        show: false,
        movable: true,
        frame: false,
        transparent: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true
    });

    // Load the React app
    const startUrl = isDev()
        ? 'http://localhost:5173'  // Vite dev server port
        : `file://${path.resolve(__dirname, '../dist/index.html')}`;

    console.log('🔍 Loading URL:', startUrl);
    console.log('🔍 __dirname:', __dirname);
    console.log('🔍 Resolved path:', path.resolve(__dirname, '../dist/index.html'));

    mainWindow.loadURL(startUrl);
    
    // 完全移除菜单栏
    mainWindow.removeMenu();

    // 监听页面加载事件
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('❌ Failed to load:', validatedURL, errorCode, errorDescription);
    });

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('✅ Page loaded successfully');
    });

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        // Open DevTools in development
        if (isDev()) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle window controls for custom title bar
    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('window-maximized');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('window-unmaximized');
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
    createWindow();
    
    // 初始化文字选择处理器 - 传入主窗口引用
    textSelectionHandler = new TextSelectionHandler(mainWindow);
    await textSelectionHandler.init();
    
    console.log('🎯 全局文字选择监听已启动');
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // 清理资源
    if (textSelectionHandler) {
        textSelectionHandler.destroy();
    }
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
    });
});



// IPC handlers
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-platform', () => {
    return process.platform;
});

// 处理文字操作请求
ipcMain.on('text-action', (event, data) => {
    const { action, text } = data;
    
    console.log(`📝 执行文字操作: ${action}，文字: ${text.substring(0, 50)}...`);
    
    // 如果是来自悬浮窗口的操作，使用textSelectionHandler处理
    if (textSelectionHandler) {
        textSelectionHandler.handleTextAction(data);
        return;
    }
    
    // 否则使用原有的处理方式
    switch (action) {
        case 'translate':
            handleTranslate(text);
            break;
        case 'explain':
            handleExplain(text);
            break;
        case 'search':
            handleSearch(text);
            break;
        case 'speak':
            handleSpeak(text);
            break;
        default:
            console.log('❌ 未知的文字操作:', action);
    }
});

// 文字操作处理函数
function handleTranslate(text) {
    // 发送到主窗口进行翻译
    if (mainWindow) {
        mainWindow.webContents.send('translate-text', text);
        mainWindow.show();
        mainWindow.focus();
    }
}

function handleExplain(text) {
    // 发送到主窗口进行解释
    if (mainWindow) {
        mainWindow.webContents.send('explain-text', text);
        mainWindow.show();
        mainWindow.focus();
    }
}

function handleSearch(text) {
    // 在默认浏览器中搜索
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    shell.openExternal(searchUrl);
}

function handleSpeak(text) {
    // 发送到主窗口进行语音播报
    if (mainWindow) {
        mainWindow.webContents.send('speak-text', text);
    }
}

// Window control handlers
ipcMain.on('window-minimize', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) {
        mainWindow.close();
    }
}); 