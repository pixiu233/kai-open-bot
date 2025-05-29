/// API client utility using environment configuration
/// 使用环境配置的API客户端工具

import { appConfig } from '../config/env';

/// API response interface
/// API响应接口
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    code?: number;
}

/// HTTP request options
/// HTTP请求选项
export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

/// API client class
/// API客户端类
export class ApiClient {
    private baseUrl: string;
    private timeout: number;

    constructor() {
        this.baseUrl = appConfig.apiBaseUrl;
        this.timeout = appConfig.apiTimeout;
    }

    /// Make HTTP request
    /// 发起HTTP请求
    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            method = 'GET',
            headers = {},
            body,
            timeout = this.timeout,
        } = options;

        const url = `${this.baseUrl}${endpoint}`;

        /// Log request in debug mode
        /// 在调试模式下记录请求
        if (appConfig.enableDebug) {
            console.log(`🌐 API请求: ${method} ${url}`, { body, headers });
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            /// Log response in debug mode
            /// 在调试模式下记录响应
            if (appConfig.enableDebug) {
                console.log(`✅ API响应: ${method} ${url}`, data);
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
                code: response.status,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';

            /// Log error in debug mode
            /// 在调试模式下记录错误
            if (appConfig.enableDebug) {
                console.error(`❌ API错误: ${method} ${url}`, errorMessage);
            }

            return {
                success: false,
                message: errorMessage,
                code: 500,
            };
        }
    }

    /// GET request
    /// GET请求
    async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    /// POST request
    /// POST请求
    async post<T = any>(
        endpoint: string,
        body?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'POST', body, headers });
    }

    /// PUT request
    /// PUT请求
    async put<T = any>(
        endpoint: string,
        body?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }

    /// DELETE request
    /// DELETE请求
    async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

/// Default API client instance
/// 默认API客户端实例
export const apiClient = new ApiClient();

/// Mock API responses for development
/// 开发环境的模拟API响应
export const mockApi = {
    /// Get user info
    /// 获取用户信息
    getUserInfo: async (): Promise<ApiResponse<{ id: number; name: string; email: string }>> => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return {
            success: true,
            data: {
                id: 1,
                name: '张三',
                email: 'zhangsan@example.com',
            },
        };
    },

    /// Get app settings
    /// 获取应用设置
    getAppSettings: async (): Promise<ApiResponse<{ theme: string; language: string }>> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            data: {
                theme: 'light',
                language: 'zh-CN',
            },
        };
    },
};

/// Use mock API in development mode if enabled
/// 在开发模式下使用模拟API（如果启用）
export const api = appConfig.enableMock ? mockApi : apiClient; 