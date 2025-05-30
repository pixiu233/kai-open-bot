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