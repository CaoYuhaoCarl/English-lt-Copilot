// AI 模型配置
export const AI_MODELS = {
  DEFAULT: 'anthropic/claude-3.5-sonnet',
  SIMILAR_QUESTIONS: 'openai/gpt-4o-mini',
} as const;

// AI 请求配置
export const AI_REQUEST_CONFIG = {
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 2000,
  TIMEOUT: 30000, // 请求超时时间，毫秒
} as const;

// OpenRouter API 配置
export const OPENROUTER_CONFIG = {
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  APP_NAME: 'Carl English Learning System',
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    'X-Title': btoa(OPENROUTER_CONFIG.APP_NAME)
  })
} as const;

// 错误信息配置
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'OpenRouter API key is not configured',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  INVALID_RESPONSE: 'API返回的数据格式无效',
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  AUTH_ERROR: 'API认证失败，请联系管理员',
  UNKNOWN_ERROR: '未知错误',
} as const;
