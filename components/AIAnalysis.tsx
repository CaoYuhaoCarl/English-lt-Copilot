'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Student } from '@/lib/types';
import questionsData from '@/data/questions.json';
import AIConfigPanel from './analysis/AIConfigPanel';
import MistakeCarousel from './analysis/MistakeCarousel';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface AIAnalysisProps {
  student: Student;
  onAnalysisUpdate: (key: string, result: any) => void;
  onInteractionUpdate: (key: string, history: Array<{ role: string; content: string }>) => void;
}

export default function AIAnalysis({ 
  student,
  onAnalysisUpdate,
  onInteractionUpdate
}: AIAnalysisProps) {
  const { 
    isLoading, 
    error, 
    analysisResults, 
    analyzeError,
    regenerateAnalysis,
    config,
    updateConfig,
    interactionHistory,
    addInteraction
  } = useAIAnalysis();

  useEffect(() => {
    Object.entries(analysisResults).forEach(([key, result]) => {
      onAnalysisUpdate(key, result);
    });
  }, [analysisResults, onAnalysisUpdate]);

  useEffect(() => {
    Object.entries(interactionHistory).forEach(([key, history]) => {
      onInteractionUpdate(key, history);
    });
  }, [interactionHistory, onInteractionUpdate]);

  const mistakes = React.useMemo(() => {
    return student.testHistory.flatMap(test => 
      test.details
        .filter(detail => !detail.isCorrect)
        .map(detail => {
          const question = questionsData.questions.find(q => q.id === detail.questionId);
          if (!question) return null;
          return {
            test,
            detail,
            question
          };
        })
        .filter(Boolean)
    );
  }, [student.testHistory]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI智师</CardTitle>
          <div className="flex items-center gap-2">
            <AIConfigPanel config={config} onConfigChange={updateConfig} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <MistakeCarousel
          mistakes={mistakes}
          isLoading={isLoading}
          analysisResults={analysisResults}
          onAnalyze={analyzeError}
          onRegenerate={regenerateAnalysis}
          onAddInteraction={addInteraction}
        />
      </CardContent>
    </Card>
  );
}