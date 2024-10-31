'use client';

import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, BookOpen, Target, Lightbulb } from 'lucide-react';
import { Question } from '@/lib/types';
import { useTTS } from '@/hooks/useTTS';
import { useAIInteraction } from '@/hooks/useAIInteraction';
import { cn } from '@/lib/utils';
import TTSButton from './TTSButton';
import AIInteractionPanel from './AIInteractionPanel';

interface AnalysisTabsProps {
  analysisResult: {
    errorAnalysis?: string;
    guidance?: string;
    similarQuestions?: string;
    keyPointSummary?: string;
    abilityImprovement?: string;
  };
  question: Question;
  onAddInteraction?: (message: { role: string; content: string }) => void;
}

const TABS = [
  { id: 'analysis', label: '错误分析', icon: Brain, key: 'errorAnalysis' },
  { id: 'guidance', label: '启发引导', icon: MessageSquare, key: 'guidance' },
  { id: 'practice', label: '练习题', icon: BookOpen, key: 'similarQuestions' },
  { id: 'keypoint', label: '知识点', icon: Target, key: 'keyPointSummary' },
  { id: 'ability', label: '能力提升', icon: Lightbulb, key: 'abilityImprovement' }
];

export default function AnalysisTabs({ 
  analysisResult, 
  question,
  onAddInteraction 
}: AnalysisTabsProps) {
  const { speak, stop, pause, resume, isSpeaking, isPaused } = useTTS();
  const { sendMessage, clearHistory, conversationHistory } = useAIInteraction();
  const [showInteraction, setShowInteraction] = useState(false);

  const handleTTS = useCallback((text: string) => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  }, [isSpeaking, isPaused, speak, pause, resume]);

  const getQuestionContext = useCallback(() => {
    return `
题目：${question.question}
正确答案：${question.answer}
题目类型：${question.type}
知识点：${question.keyPoint}
考察能力：${question.ability}
    `.trim();
  }, [question]);

  const handleSendMessage = useCallback(async (message: string) => {
    const response = await sendMessage(message, analysisResult, getQuestionContext());
    if (onAddInteraction) {
      onAddInteraction({ role: 'user', content: message });
      onAddInteraction({ role: 'assistant', content: response });
    }
    return response;
  }, [sendMessage, analysisResult, getQuestionContext, onAddInteraction]);

  React.useEffect(() => {
    return () => stop();
  }, [stop]);

  // 过滤出有内容的标签页
  const availableTabs = TABS.filter(tab => analysisResult[tab.key as keyof typeof analysisResult]);

  if (availableTabs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        未生成分析内容
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={availableTabs[0].id} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[400px] mt-4">
          {availableTabs.map(({ id, key }) => (
            <TabsContent key={id} value={id} className="prose dark:prose-invert relative">
              <TTSButton
                onClick={() => handleTTS(analysisResult[key as keyof typeof analysisResult] || '')}
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                className="absolute top-0 right-0"
              />
              <div className="whitespace-pre-wrap pr-12">
                {analysisResult[key as keyof typeof analysisResult]}
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      <div className={cn(
        "transition-all duration-300",
        showInteraction ? "h-[300px]" : "h-0"
      )}>
        {showInteraction && (
          <AIInteractionPanel
            questionContext={getQuestionContext()}
            analysisResult={analysisResult}
            onSendMessage={handleSendMessage}
            conversationHistory={conversationHistory}
            onClearHistory={clearHistory}
          />
        )}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowInteraction(!showInteraction)}
      >
        {showInteraction ? "收起AI互动" : "展开AI互动"}
      </Button>
    </div>
  );
}