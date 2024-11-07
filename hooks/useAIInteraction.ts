import { useState, useCallback } from 'react';
import { AIAnalysisResult } from '@/lib/aiTypes';
import { useToast } from "@/components/ui/use-toast";
import { AI_MODELS, OPENROUTER_CONFIG } from '@/lib/config/ai';

interface ContextMatch {
  section: string;
  content: string;
  similarity: number;
}

export function useAIInteraction() {
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const { toast } = useToast();

  const findRelevantContext = (
    message: string,
    analysisResult: AIAnalysisResult
  ): ContextMatch[] => {
    const sections = {
      errorAnalysis: '错误分析',
      guidance: '启发引导',
      similarQuestions: '练习题',
      keyPointSummary: '知识点',
      abilityImprovement: '能力提升'
    };

    return Object.entries(sections)
      .map(([key, label]) => {
        const content = analysisResult[key as keyof AIAnalysisResult];
        if (!content) return null;
        const similarity = calculateContextSimilarity(message, content);
        return {
          section: label,
          content,
          similarity
        };
      })
      .filter((match): match is ContextMatch => match !== null && match.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity);
  };

  const calculateContextSimilarity = (message: string, context: string): number => {
    if (!message || !context) return 0;
    
    const messageWords = new Set(message.toLowerCase().split(/\s+/));
    const contextWords = new Set(context.toLowerCase().split(/\s+/));
    
    let commonWords = 0;
    messageWords.forEach(word => {
      if (contextWords.has(word)) commonWords++;
    });
    
    return commonWords / Math.max(messageWords.size, 1);
  };

  const generateSystemPrompt = (
    message: string,
    analysisResult: AIAnalysisResult,
    questionContext: string
  ): string => {
    try {
      const relevantContexts = findRelevantContext(message, analysisResult);
      
      let prompt = `你是一位专业的教育顾问，正在与学生讨论以下题目：\n${questionContext}\n\n`;
      
      if (relevantContexts.length > 0) {
        prompt += '基于之前的分析：\n';
        relevantContexts.forEach(({ section, content }) => {
          prompt += `\n${section}：\n${content}\n`;
        });
      }

      prompt += `\n请注意：
      1. 如果学生的问题与之前的分析内容相关，请结合相关内容进行回答
      2. 回答要具体、清晰，并鼓励学生思考
      3. 可以适时提供额外的例子或解释
      4. 保持耐心和引导性，帮助学生真正理解问题`;

      return prompt;
    } catch (error) {
      console.error('Error generating system prompt:', error);
      throw new Error('生成系统提示时出错');
    }
  };

  const sendMessage = useCallback(async (
    message: string,
    analysisResult: AIAnalysisResult,
    questionContext: string
  ): Promise<string> => {
    if (!message.trim()) {
      throw new Error('消息不能为空');
    }

    try {
      const systemPrompt = generateSystemPrompt(message, analysisResult, questionContext);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await fetch(OPENROUTER_CONFIG.API_URL, {
        method: 'POST',
        headers: OPENROUTER_CONFIG.getHeaders(),
        body: JSON.stringify({
          model: AI_MODELS.DEFAULT,
          messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API 请求失败: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('API 返回的数据格式无效');
      }

      const aiResponse = data.choices[0].message.content;

      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]);

      return aiResponse;
    } catch (error) {
      console.error('Error in AI interaction:', error);
      const errorMessage = error instanceof Error ? error.message : '与 AI 对话时出现未知错误';
      toast({
        variant: "destructive",
        title: "对话失败",
        description: errorMessage
      });
      throw error;
    }
  }, [conversationHistory, toast]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  return {
    sendMessage,
    clearHistory,
    conversationHistory
  };
}