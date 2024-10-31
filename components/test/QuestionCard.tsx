'use client';

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  isFlipped: boolean;
  onAnswer: (id: number, value: boolean) => void;
}

export default function QuestionCard({
  question,
  isFlipped,
  onAnswer,
}: QuestionCardProps) {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFlipped) return;
      
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        onAnswer(question.id, true);
      }
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        onAnswer(question.id, false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question.id, isFlipped, onAnswer]);

  const renderQuestionContent = (text: string) => {
    if (question.type === '语法') {
      const parts = text.split(/(\([^)]+\))/);
      return (
        <div className="inline-flex flex-wrap justify-center items-center gap-2">
          {parts.map((part, index) => {
            if (part.startsWith('(') && part.endsWith(')')) {
              return (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-lg px-3 py-1"
                >
                  {part}
                </Badge>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    }
    return text;
  };

  return (
    <Card className="min-h-[400px] p-6">
      <div className="flex gap-2 mb-6">
        <Badge variant="outline" className="text-sm">
          {question.type}
        </Badge>
        <Badge variant="secondary" className="text-sm">
          {question.score}分
        </Badge>
        <Badge variant="secondary" className="text-sm flex items-center gap-1">
          <Timer className="w-3 h-3" />
          {question.timeLimit}秒
        </Badge>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[200px] mb-6">
        <div 
          className={cn(
            "text-center w-full px-4",
            "transition-all duration-200",
            question.type === '句子' || question.type === '语法' 
              ? "text-[min(4vw,2rem)] leading-[1.4]" 
              : "text-[min(8vw,4rem)] leading-[1.2]",
            "md:text-[min(4vw,3rem)]"
          )}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          {renderQuestionContent(question.question)}
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <Button
          onClick={() => onAnswer(question.id, true)}
          disabled={isFlipped}
          className={cn(
            "h-16 px-8 text-lg gap-2",
            "transform hover:scale-105 active:scale-95",
            "transition-all duration-100",
            "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          <CheckCircle2 className="w-5 h-5" />
          知道
        </Button>
        <Button
          onClick={() => onAnswer(question.id, false)}
          disabled={isFlipped}
          className={cn(
            "h-16 px-8 text-lg gap-2",
            "transform hover:scale-105 active:scale-95",
            "transition-all duration-100",
            "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          )}
        >
          <XCircle className="w-5 h-5" />
          不知道
        </Button>
      </div>
    </Card>
  );
}