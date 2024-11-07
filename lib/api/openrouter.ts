import { 
  AI_MODELS, 
  AI_REQUEST_CONFIG, 
  OPENROUTER_CONFIG,
  ERROR_MESSAGES 
} from '@/lib/config/ai';
import { AIRequestConfig } from '@/lib/types';

if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
  console.error(ERROR_MESSAGES.API_KEY_MISSING);
}

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
    const response = await fetch(OPENROUTER_CONFIG.API_URL, {
      method: 'POST',
      headers: OPENROUTER_CONFIG.getHeaders(),
      body: JSON.stringify({
        model: config.model || AI_MODELS.DEFAULT,
        messages: config.messages,
        temperature: config.temperature || AI_REQUEST_CONFIG.DEFAULT_TEMPERATURE,
        max_tokens: config.maxTokens || AI_REQUEST_CONFIG.DEFAULT_MAX_TOKENS
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
      throw new OpenRouterError(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new OpenRouterError(ERROR_MESSAGES.NETWORK_ERROR);
    }

    throw new OpenRouterError(
      error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR
    );
  }
}