import { useState, useCallback, useRef, useEffect } from 'react';
import { Question, TestDetail, AIRequestConfig } from '@/lib/types';
import { AIAnalysisConfig, AIAnalysisResult } from '@/lib/aiTypes';
import { defaultAnalysisConfig } from '@/lib/aiConfig';
import { useToast } from "@/components/ui/use-toast";
import { makeOpenRouterRequest } from '@/lib/api/openrouter';
import { handleAIError } from '@/lib/utils/errorHandling';
import { AI_MODELS } from '@/lib/config/ai';

interface InteractionMessage {
  role: string;
  content: string;
}

export function useAIAnalysis() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AIAnalysisResult>>({});
  const [config, setConfig] = useState<AIAnalysisConfig>(defaultAnalysisConfig);
  const [interactionHistory, setInteractionHistory] = useState<Record<string, InteractionMessage[]>>({});
  const configRef = useRef<AIAnalysisConfig>(config);
  const { toast } = useToast();

  const updateConfig = useCallback((newConfig: AIAnalysisConfig) => {
    configRef.current = newConfig;
    setConfig(newConfig);
    try {
      localStorage.setItem('aiAnalysisConfig', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('aiAnalysisConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        updateConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
    }
  }, [updateConfig]);

  const generatePrompt = useCallback((
    type: keyof AIAnalysisConfig,
    question: Question,
    detail: TestDetail
  ) => {
    const currentConfig = configRef.current[type];
    const { format, style, prompt, count } = currentConfig;
    
    const baseContext = `
      题目类型：${question.type}
      知识点：${question.keyPoint}
      考察能力：${question.ability}
      题目：${question.question}
      正确答案：${question.answer}
      学生答案：${detail.userAnswer}
      答题用时：${detail.time / 1000}秒
    `;

    if (prompt) {
      return `
        作为一位${style}的教育专家，请${format}完成以下分析：
        ${baseContext}
        ${prompt}
      `;
    }

    const defaultPrompts: Record<keyof AIAnalysisConfig, string> = {
      errorAnalysis: `
        作为一位${style}的教育专家，请${format}分析以下学生的答题错误：
        ${baseContext}
        请从以下几个方面进行分析：
        1. 错误原因分析（考虑认知误区、知识盲点等）
        2. 学生当前对该知识点的掌握程度评估
        3. 具体的改进建议
      `,
      guidance: `
        基于以下具体错题情况，请以${style}的方式，${format}设计一段启发式教学对话：
        ${baseContext}
        设计一个对话，通过提问引导学生发现错误并理解正确答案。
      `,
      similarQuestions: `
        请基于以下错题信息，以${style}的方式生成练习题：
        ${baseContext}
        要求：
        1. ${format}
        2. 题目难度应该循序渐进
        3. 每道题都要有详细的解析
        4. 严格按照要求只生成 ${count} 道题目，不多不少
        5. 请确认：本次将生成 ${count} 道题目
      `,
      keyPointSummary: `
        请以${style}的方式，${format}总结以下知识点：
        ${baseContext}
        重点关注：
        1. 核心概念解释
        2. 常见误区分析
        3. 掌握要点提示
      `,
      abilityImprovement: `
        请以${style}的方式，${format}提供能力提升建议：
        ${baseContext}
        包含：
        1. 针对性训练方法
        2. 实践建议
        3. 进阶学习路径
      `
    };

    return defaultPrompts[type];
  }, []);

  const analyzeError = useCallback(async (
    question: Question,
    detail: TestDetail,
    testId: number
  ) => {
    const key = `${testId}-${detail.questionId}`;
    setIsLoading(prev => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const currentConfig = configRef.current;
      const enabledModules = Object.entries(currentConfig)
        .filter(([_, settings]) => settings.enabled)
        .map(([type]) => type as keyof AIAnalysisConfig);

      if (enabledModules.length === 0) {
        throw new Error('请至少启用一个分析模块');
      }

      const results = await Promise.all(
        enabledModules.map(async type => {
          const prompt = generatePrompt(type, question, detail);
          const config: AIRequestConfig = {
            model: type === 'similarQuestions' ? AI_MODELS.SIMILAR_QUESTIONS : AI_MODELS.DEFAULT,
            messages: [{ role: 'user', content: prompt }]
          };

          const content = await makeOpenRouterRequest(config);
          return { type, content };
        })
      );

      const analysisResult = results.reduce((acc, { type, content }) => ({
        ...acc,
        [type]: content
      }), {});

      setAnalysisResults(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...analysisResult
        }
      }));

      toast({
        title: "分析完成",
        description: "AI分析已生成，请查看详细内容",
      });

    } catch (error) {
      const errorMessage = handleAIError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [generatePrompt, toast]);

  const addInteraction = useCallback((key: string, message: InteractionMessage) => {
    setInteractionHistory(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), message]
    }));
  }, []);

  const regenerateAnalysis = useCallback(async (
    question: Question,
    detail: TestDetail,
    testId: number,
    moduleType: keyof AIAnalysisConfig
  ) => {
    const key = `${testId}-${detail.questionId}`;
    setIsLoading(prev => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const prompt = generatePrompt(moduleType, question, detail);
      const config: AIRequestConfig = {
        model: moduleType === 'similarQuestions' ? AI_MODELS.SIMILAR_QUESTIONS : AI_MODELS.DEFAULT,
        messages: [{ role: 'user', content: prompt }]
      };

      const content = await makeOpenRouterRequest(config);

      setAnalysisResults(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [moduleType]: content
        }
      }));

      toast({
        title: "重新生成完成",
        description: "AI分析已更新，请查看最新内容",
      });

    } catch (error) {
      const errorMessage = handleAIError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  }, [generatePrompt, toast]);

  return {
    isLoading,
    error,
    analysisResults,
    analyzeError,
    config,
    updateConfig,
    interactionHistory,
    addInteraction,
    regenerateAnalysis
  };
}