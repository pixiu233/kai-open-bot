/**
 * Check if app is running in development mode
 * @returns {boolean} true if in development mode
 */
function isDev() {
    // 强制设置为开发模式，确保连接到开发服务器
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }
    
    return process.env.NODE_ENV === 'development' ||
        process.defaultApp ||
        /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
        /[\\/]electron[\\/]/.test(process.execPath);
}

/**
 * Get the resources path based on environment
 * @returns {string} path to resources
 */
function getResourcesPath() {
    if (isDev()) {
        return process.cwd();
    }
    return process.resourcesPath;
}

/**
 * Get the app data path
 * @returns {string} path to app data
 */
function getAppDataPath() {
    const { app } = require('electron');
    return app.getPath('userData');
}

module.exports = {
    isDev,
    getResourcesPath,
    getAppDataPath
}; 