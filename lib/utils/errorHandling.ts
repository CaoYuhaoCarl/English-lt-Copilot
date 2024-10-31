import { toast } from '@/components/ui/use-toast';
import { OpenRouterError } from '@/lib/api/openrouter';

export function handleAIError(error: unknown) {
  console.error('AI Analysis Error:', error);

  let title = '分析失败';
  let description = '处理请求时出现错误，请稍后重试';

  if (error instanceof OpenRouterError) {
    if (error.status === 429) {
      description = '请求过于频繁，请稍后再试';
    } else if (error.status === 401) {
      description = 'API认证失败，请联系管理员';
    } else {
      description = error.message;
    }
  } else if (error instanceof Error) {
    description = error.message;
  }

  toast({
    variant: "destructive",
    title,
    description,
  });

  return description;
}