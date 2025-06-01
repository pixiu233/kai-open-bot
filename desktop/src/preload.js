const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // App info
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),

    // Window controls
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    maximizeWindow: () => ipcRenderer.send('window-maximize'),
    closeWindow: () => ipcRenderer.send('window-close'),

    // Menu events
    onMenuNew: (callback) => ipcRenderer.on('menu-new', callback),
    onMenuOpen: (callback) => ipcRenderer.on('menu-open', callback),

    // Window state events
    onWindowMaximized: (callback) => ipcRenderer.on('window-maximized', callback),
    onWindowUnmaximized: (callback) => ipcRenderer.on('window-unmaximized', callback),

    // Text action events - 文字操作事件
    onTranslateText: (callback) => ipcRenderer.on('translate-text', callback),
    onExplainText: (callback) => ipcRenderer.on('explain-text', callback),
    onSpeakText: (callback) => ipcRenderer.on('speak-text', callback),
    
    // 新增：文字选择相关的IPC通信
    onTextSelected: (callback) => {
        ipcRenderer.on('text-selected', (event, text) => {
            // 只传递文字字符串，不传递事件对象
            callback(text);
        });
    },
    sendTextAction: (data) => ipcRenderer.send('text-action', data),
    onTextAction: (callback) => {
        ipcRenderer.on('text-action', (event, data) => {
            // 只传递数据对象，不传递事件对象
            callback(data);
        });
    },

    // Remove listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

    // File operations (可以根据需要添加更多)
    openFile: () => ipcRenderer.invoke('dialog-open-file'),
    saveFile: (content) => ipcRenderer.invoke('dialog-save-file', content),

    // Theme
    setTheme: (theme) => ipcRenderer.send('set-theme', theme),
    getTheme: () => ipcRenderer.invoke('get-theme'),
    onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback)
});

// Console log for debugging
console.log('Preload script loaded successfully'); 