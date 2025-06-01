// Global type definitions
// 全局类型定义

// Electron API type definitions
interface ElectronAPI {
  // App info
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;

  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // Menu events
  onMenuNew: (callback: (event: any) => void) => void;
  onMenuOpen: (callback: (event: any) => void) => void;

  // Window state events
  onWindowMaximized: (callback: (event: any) => void) => void;
  onWindowUnmaximized: (callback: (event: any) => void) => void;

  // Text action events - 文字操作事件
  onTranslateText: (callback: (event: any, text: string) => void) => void;
  onExplainText: (callback: (event: any, text: string) => void) => void;
  onSpeakText: (callback: (event: any, text: string) => void) => void;

  // 文字选择相关的IPC通信
  onTextSelected: (callback: (text: string) => void) => void;
  sendTextAction: (data: { action: string; text: string }) => void;
  onTextAction: (callback: (data: { action: string; text: string }) => void) => void;

  // Remove listeners
  removeAllListeners: (channel: string) => void;

  // File operations
  openFile: () => Promise<any>;
  saveFile: (content: any) => Promise<any>;

  // Theme
  setTheme: (theme: string) => void;
  getTheme: () => Promise<string>;
  onThemeChanged: (callback: (event: any, theme: string) => void) => void;
}

interface Window {
    electronAPI?: ElectronAPI;
}