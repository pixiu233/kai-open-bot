/// DashScope API client for Alibaba Cloud AI services
/// 阿里云灵积DashScope API客户端

import { appConfig } from '../config/env';

/// DashScope chat message interface
/// DashScope聊天消息接口
export interface DashScopeMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/// DashScope chat request interface
/// DashScope聊天请求接口
export interface DashScopeChatRequest {
    model: string;
    input: {
        messages: DashScopeMessage[];
    };
    parameters?: {
        result_format?: 'text' | 'message';
        seed?: number;
        max_tokens?: number;
        top_p?: number;
        top_k?: number;
        repetition_penalty?: number;
        temperature?: number;
        stop?: string | string[];
        enable_search?: boolean;
    };
}

/// DashScope chat response interface
/// DashScope聊天响应接口
export interface DashScopeChatResponse {
    output: {
        text?: string;
        finish_reason: string;
        choices?: Array<{
            finish_reason: string;
            message: DashScopeMessage;
        }>;
    };
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
    request_id: string;
}

/// DashScope API client class
/// DashScope API客户端类
export class DashScopeClient {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = appConfig.dashscopeApiKey || '';
        this.baseUrl = appConfig.dashscopeBaseUrl || 'https://dashscope.aliyuncs.com/api/v1';

        if (!this.apiKey) {
            console.warn('⚠️ DashScope API密钥未设置，请在环境变量中配置 VITE_DASHSCOPE_API_KEY');
        }
    }

    /// Check if API key is configured
    /// 检查API密钥是否已配置
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /// Send chat completion request
    /// 发送聊天完成请求
    async chatCompletion(request: DashScopeChatRequest): Promise<DashScopeChatResponse> {
        if (!this.isConfigured()) {
            throw new Error('DashScope API密钥未配置');
        }

        const url = `${this.baseUrl}/services/aigc/text-generation/generation`;

        /// Log request in debug mode
        /// 在调试模式下记录请求
        if (appConfig.enableDebug) {
            console.log('🤖 DashScope请求:', {
                model: request.model,
                messages: request.input.messages,
                parameters: request.parameters
            });
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'X-DashScope-SSE': 'disable'
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`DashScope API错误: ${response.status} - ${errorText}`);
            }

            const data: DashScopeChatResponse = await response.json();

            /// Log response in debug mode
            /// 在调试模式下记录响应
            if (appConfig.enableDebug) {
                console.log('✅ DashScope响应:', {
                    finish_reason: data.output.finish_reason,
                    tokens: data.usage,
                    request_id: data.request_id
                });
            }

            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';

            /// Log error in debug mode
            /// 在调试模式下记录错误
            if (appConfig.enableDebug) {
                console.error('❌ DashScope错误:', errorMessage);
            }

            throw error;
        }
    }

    /// Simple chat method with Qwen model
    /// 使用通义千问模型的简单聊天方法
    async chat(
        message: string,
        model: string = 'qwen-turbo',
        systemPrompt?: string
    ): Promise<string> {
        const messages: DashScopeMessage[] = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        messages.push({ role: 'user', content: message });

        const request: DashScopeChatRequest = {
            model,
            input: { messages },
            parameters: {
                result_format: 'message',
                temperature: 0.7,
                max_tokens: 2000
            }
        };

        const response = await this.chatCompletion(request);

        if (response.output.choices && response.output.choices.length > 0) {
            return response.output.choices[0].message.content;
        }

        return response.output.text || '';
    }
}

/// Default DashScope client instance
/// 默认DashScope客户端实例
export const dashscopeClient = new DashScopeClient();

/// Available DashScope models
/// 可用的DashScope模型
export const DASHSCOPE_MODELS = {
    QWEN_TURBO: 'qwen-turbo',
    QWEN_PLUS: 'qwen-plus',
    QWEN_MAX: 'qwen-max',
    QWEN_MAX_LONGCONTEXT: 'qwen-max-longcontext',
} as const;

/// Mock DashScope responses for development
/// 开发环境的模拟DashScope响应
export const mockDashScope = {
    /// Mock chat completion
    /// 模拟聊天完成
    async chatCompletion(request: DashScopeChatRequest): Promise<DashScopeChatResponse> {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        const userMessage = request.input.messages.find(m => m.role === 'user')?.content || '';

        return {
            output: {
                choices: [{
                    finish_reason: 'stop',
                    message: {
                        role: 'assistant',
                        content: `这是一个模拟回复：您说了"${userMessage}"，我理解了您的意思。`
                    }
                }],
                finish_reason: 'stop'
            },
            usage: {
                input_tokens: 10,
                output_tokens: 20,
                total_tokens: 30
            },
            request_id: 'mock-request-' + Date.now()
        };
    },

    /// Mock simple chat
    /// 模拟简单聊天
    async chat(message: string): Promise<string> {
        const response = await this.chatCompletion({
            model: 'qwen-turbo',
            input: { messages: [{ role: 'user', content: message }] }
        });

        return response.output.choices?.[0]?.message.content || '';
    }
};

/// Use mock DashScope in development mode if enabled or API key not configured
/// 在开发模式下使用模拟DashScope（如果启用或API密钥未配置）
export const dashscope = (appConfig.enableMock || !dashscopeClient.isConfigured())
    ? mockDashScope
    : dashscopeClient; 