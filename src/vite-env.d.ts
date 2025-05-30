/// <reference types="vite/client" />

/// Environment variables type definitions
/// 环境变量类型定义
interface ImportMetaEnv {
    // App configuration
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_DESCRIPTION: string;

    // API configuration
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT: string;

    // Feature flags
    readonly VITE_ENABLE_DEBUG: string;
    readonly VITE_ENABLE_MOCK: string;

    // AI services
    readonly VITE_DASHSCOPE_API_KEY: string;
    readonly VITE_DASHSCOPE_BASE_URL: string;

    // Third-party services
    readonly VITE_ANALYTICS_ID: string;
    readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
