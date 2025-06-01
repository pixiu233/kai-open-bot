/**
 * 检测是否在 Electron 环境中运行
 * @returns {boolean} 是否为 Electron 环境
 */
export const isElectron = (): boolean => {
  return !!window.electronAPI;
};

/**
 * 检测是否在移动设备上运行
 * @returns {boolean} 是否为移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 检测是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * 检测是否为生产环境
 * @returns {boolean} 是否为生产环境
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * 获取当前平台信息
 * @returns {string} 平台信息
 */
export const getPlatform = (): string => {
  if (isElectron()) {
    return 'electron';
  }
  if (isMobile()) {
    return 'mobile';
  }
  return 'web';
};

/**
 * Electron 窗口控制操作
 */
export const electronWindowControls = {
  minimize: () => {
    if (isElectron()) {
      window.electronAPI?.minimizeWindow();
    }
  },
  maximize: () => {
    if (isElectron()) {
      window.electronAPI?.maximizeWindow();
    }
  },
  close: () => {
    if (isElectron()) {
      window.electronAPI?.closeWindow();
    }
  },
};

/**
 * 环境相关的配置
 */
export const environmentConfig = {
  isElectron: isElectron(),
  isMobile: isMobile(),
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),
  platform: getPlatform(),
}; 