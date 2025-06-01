const { BrowserWindow, screen, clipboard } = require('electron');
const logger = require('./logger');
const { 
    isCtrlKey, 
    isCtrlC, 
    getKeyFriendlyName,
    LETTER_KEYS,
    VIRTUAL_KEY_CODES 
} = require('./keyboardConstants');
const path = require('path');

// 使用 require 来导入 GlobalKeyboardListener
const { GlobalKeyboardListener } = require('node-global-key-listener');

class TextSelectionHandler {
    constructor(mainWindow) {
        this.overlayWindow = null;
        this.keyListener = null;
        this.isCtrlPressed = false;
        this.lastSelectedText = '';
        this.selectionTimeout = null;
        this.mainWindow = mainWindow; // 保存主窗口引用用于IPC通信
    }

    async init() {
        logger.info('开始初始化文字选择处理器...');
        
        try {
            this.setupGlobalKeyListener();
            logger.info('全局键盘监听已设置');
            
            // 测试剪贴板功能
            try {
                const testRead = clipboard.readText();
                logger.info(`剪贴板测试成功，当前内容长度: ${testRead.length}`);
            } catch (error) {
                logger.error(`剪贴板测试失败: ${error}`);
            }
            
        } catch (error) {
            logger.error(`初始化失败: ${error}`);
        }
    }

    setupGlobalKeyListener() {
        try {
            this.keyListener = new GlobalKeyboardListener();
            logger.info('GlobalKeyboardListener 创建成功');
            
            if (this.keyListener !== null) {
                this.keyListener.addListener((e, down) => {
                    const isDown = down[e.name];
                    const keyName = e.name || '';
                    const vKey = e.vKey || 0;
                    
                    // 记录所有键盘事件用于调试
                    const friendlyName = getKeyFriendlyName(keyName, vKey);
                    
                    // 处理 Ctrl 键状态 - 使用统一的检查函数
                    if (isCtrlKey(keyName, vKey)) {
                        this.isCtrlPressed = isDown;
                        return; // 处理完 Ctrl 键就返回
                    }

                    // 检查 Ctrl+C 组合键 - 使用统一的检查函数
                    if (isDown && isCtrlC(keyName, vKey, this.isCtrlPressed)) {
                        logger.info('检测到 Ctrl+C 组合键，开始处理...');
                        // 延迟一点时间让复制操作完成
                        setTimeout(() => {
                            this.handleTextSelection();
                        }, 200);
                    }
                });
            }
            
            logger.info('事件监听器已注册');
            
        } catch (error) {
            logger.error(`设置全局键盘监听失败: ${error}`);
        }
    }

    async handleTextSelection() {
        logger.info('开始处理文字选择...');
        
        try {
            const selectedText = clipboard.readText();
            logger.info(`读取到剪贴板内容: 长度=${selectedText.length}, 预览=${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}`);
            
            // 检查是否是新选中的文字（避免重复显示）
            if (selectedText && selectedText !== this.lastSelectedText && selectedText.trim().length > 0) {
                logger.info('检测到新文字，准备显示悬浮窗口');
                this.lastSelectedText = selectedText;
                this.showOverlay(selectedText);
            } else {
                logger.info('跳过显示：文字为空或与上次相同');
            }
        } catch (error) {
            logger.error(`读取剪贴板失败: ${error}`);
        }
    }

    showOverlay(text) {
        logger.info('创建悬浮窗口...');
        
        // 关闭之前的覆盖窗口
        if (this.overlayWindow) {
            logger.info('关闭之前的悬浮窗口');
            this.overlayWindow.close();
        }

        try {
            // 获取鼠标位置
            const mousePos = screen.getCursorScreenPoint();
            logger.info(`鼠标位置: x=${mousePos.x}, y=${mousePos.y}`);
            
            // 创建悬浮窗口
            this.overlayWindow = new BrowserWindow({
                width: 1600,
                height: 320,
                x: mousePos.x - 150,
                y: mousePos.y - 140,
                frame: false,                    // 移除窗口边框和标题栏
                transparent: true,               // 背景透明
                alwaysOnTop: true,              // 总是在最前面
                skipTaskbar: true,              // 不在任务栏显示
                resizable: false,               // 不可调整大小
                minimizable: false,             // 不可最小化
                maximizable: false,             // 不可最大化
                closable: true,                 // 允许关闭（通过代码）
                focusable: true,                // 允许获得焦点（用于按钮点击）
                autoHideMenuBar: true,          // 自动隐藏菜单栏
                show: false,         
                titleBarStyle: 'hidden',        // 隐藏标题栏（macOS）
                trafficLightPosition: { x: -100, y: -100 }, // 隐藏红绿灯按钮（macOS）
                webPreferences: {
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

            logger.info('悬浮窗口已创建');

            // 加载React组件页面
            const { isDev } = require('./env');
            const isDevMode = isDev();
            const baseUrl = isDevMode ? 'http://localhost:5173' : `file://${path.join(__dirname, '../../dist/index.html')}`;
            
            // 创建URL并添加参数
            const overlayUrl = `${baseUrl}#/text-overlay?text=${encodeURIComponent(text)}`;
            logger.info(`环境检测: ${isDevMode ? '开发模式' : '生产模式'}`);
            logger.info(`基础URL: ${baseUrl}`);
            logger.info(`完整URL: ${overlayUrl}`);
            
            this.overlayWindow.loadURL(overlayUrl);

            // 窗口准备好后显示
            this.overlayWindow.once('ready-to-show', () => {
                logger.info('悬浮窗口准备完成，开始显示');
                if (this.overlayWindow) {
                    this.overlayWindow.show();
                }
            });

            // 监听窗口错误
            this.overlayWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
                logger.error(`悬浮窗口加载失败: ${errorCode} - ${errorDescription}`);
            });

            this.overlayWindow.webContents.on('did-finish-load', () => {
                logger.info('悬浮窗口内容加载完成');
                // 发送文字数据到渲染进程
                if (this.overlayWindow) {
                    this.overlayWindow.webContents.send('text-selected', text);
                }
            });

        
            // 当窗口失去焦点时关闭
            this.overlayWindow.on('blur', () => {
                if (this.overlayWindow) {
                    logger.info('窗口失去焦点，关闭悬浮窗口');
                    this.overlayWindow.close();
                    this.overlayWindow = null;
                }
            });

            // 窗口关闭事件
            this.overlayWindow.on('closed', () => {
                logger.info('悬浮窗口已关闭');
                this.overlayWindow = null;
            });

        } catch (error) {
            logger.error(`创建悬浮窗口失败: ${error}`);
        }
    }

    // 处理来自悬浮窗口的操作请求
    handleTextAction(data) {
        const { action, text } = data;
        logger.info(`处理文字操作: ${action}, 文字: ${text.substring(0, 50)}...`);
        
        // 将操作发送到主窗口
        if (this.mainWindow && this.mainWindow.webContents) {
            this.mainWindow.webContents.send('text-action', { action, text });
        }
        
        // 关闭悬浮窗口
        if (this.overlayWindow) {
            this.overlayWindow.close();
            this.overlayWindow = null;
        }
    }

    destroy() {
        logger.info('销毁文字选择处理器...');
        if (this.keyListener) {
            this.keyListener.kill();
            logger.info('全局键盘监听已停止');
        }
        if (this.overlayWindow) {
            this.overlayWindow.close();
            logger.info('悬浮窗口已关闭');
        }
    }
}

module.exports = TextSelectionHandler; 