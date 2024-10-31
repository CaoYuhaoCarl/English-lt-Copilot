'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Question, TestDetail } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import AnalysisTabs from './AnalysisTabs';
import QuestionDisplay from './QuestionDisplay';

interface AIAnalysisCardProps {
  question: Question;
  detail: TestDetail;
  testId: number;
  isLoading: boolean;
  analysisResult?: {
    errorAnalysis?: string;
    guidance?: string;
    similarQuestions?: string;
    keyPointSummary?: string;
    abilityImprovement?: string;
  };
  onAnalyze: () => void;
  onRegenerate: () => void;
  onAddInteraction?: (message: { role: string; content: string }) => void;
}

export default function AIAnalysisCard({
  question,
  detail,
  testId,
  isLoading,
  analysisResult,
  onAnalyze,
  onRegenerate,
  onAddInteraction
}: AIAnalysisCardProps) {
  const hasAnyContent = analysisResult && Object.values(analysisResult).some(Boolean);

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-6">
        <QuestionDisplay
          question={question}
          userAnswer={detail.userAnswer}
          answerTime={detail.time}
        />

        {!hasAnyContent && !isLoading && (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-muted/50 rounded-lg mt-6">
            <Brain className="w-12 h-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Get个性化讲解👇🏻
            </p>
            <Button 
              onClick={onAnalyze}
              className="min-w-[150px]"
            >
              GO
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-muted/50 rounded-lg mt-6 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              准备中...
            </p>
          </div>
        )}

        {hasAnyContent && !isLoading && (
          <>
            <div className="flex justify-end mb-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重新生成
              </Button>
            </div>
            <AnalysisTabs
              analysisResult={analysisResult}
              question={question}
              onAddInteraction={onAddInteraction}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}