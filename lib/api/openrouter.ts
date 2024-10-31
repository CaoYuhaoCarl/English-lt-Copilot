import { AIRequestConfig } from '@/lib/types';

const OPENROUTER_API_KEY = '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';

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export async function makeOpenRouterRequest(config: AIRequestConfig) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        // 使用 btoa 编码应用名称，避免非 ASCII 字符问题
        'X-Title': btoa('Carl English Learning System')
      },
      body: JSON.stringify({
        model: config.model,
        messages: config.messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OpenRouterError(
        errorData.error?.message || `请求失败 (${response.status}): ${response.statusText}`,
        response.status,
        errorData.error?.code
      );
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new OpenRouterError('API返回的数据格式无效');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new OpenRouterError('网络连接失败，请检查网络设置');
    }

    throw new OpenRouterError(
      error instanceof Error ? error.message : '未知错误'
    );
  }
}