/// Environment configuration management module
/// 环境变量配置管理模块

export interface AppConfig {
    // App basic info
    title: string;
    version: string;
    description: string;

    // API configuration
    apiBaseUrl: string;
    apiTimeout: number;

    // Feature flags
    enableDebug: boolean;
    enableMock: boolean;

    // Third-party services
    analyticsId?: string;
    sentryDsn?: string;

    // AI services
    dashscopeApiKey?: string;
    dashscopeBaseUrl?: string;
}

/// Get environment variable with fallback
/// 获取环境变量并提供默认值
const getEnvVar = (key: string, defaultValue: string = ''): string => {
    return import.meta.env[key] || defaultValue;
};

/// Get boolean environment variable
/// 获取布尔类型环境变量
const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
};

/// Get number environment variable
/// 获取数字类型环境变量
const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

/// Application configuration object
/// 应用配置对象
export const appConfig: AppConfig = {
    title: getEnvVar('VITE_APP_TITLE', 'Antdx Demo'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    description: getEnvVar('VITE_APP_DESCRIPTION', '基于凯哥人工智能的演示应用'),

    apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 10000),

    enableDebug: getBooleanEnvVar('VITE_ENABLE_DEBUG', true),
    enableMock: getBooleanEnvVar('VITE_ENABLE_MOCK', false),

    analyticsId: getEnvVar('VITE_ANALYTICS_ID'),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),

    // AI services configuration
    dashscopeApiKey: getEnvVar('VITE_DASHSCOPE_API_KEY'),
    dashscopeBaseUrl: getEnvVar('VITE_DASHSCOPE_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1'),
};

/// Development mode check
/// 开发模式检查
export const isDevelopment = import.meta.env.DEV;

/// Production mode check  
/// 生产模式检查
export const isProduction = import.meta.env.PROD;

/// Current mode
/// 当前模式
export const currentMode = import.meta.env.MODE;

/// Log configuration in development mode
/// 在开发模式下记录配置信息
if (isDevelopment && appConfig.enableDebug) {
    console.group('🔧 应用配置信息');
    console.log('模式:', currentMode);
    console.log('配置:', appConfig);
    console.groupEnd();
} 