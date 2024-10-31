import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: Question;
  userAnswer: string;
  answerTime: number;
}

export default function QuestionDisplay({ 
  question, 
  userAnswer,
  answerTime 
}: QuestionDisplayProps) {
  const formattedTime = (answerTime / 1000).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">题目内容：</h3>
        <p className="text-xl p-4 bg-muted/30 rounded-lg">{question.question}</p>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center text-red-500 dark:text-red-400">
          <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <span className="font-medium">你的答案：</span>
            <span className={cn(
              "ml-2 px-2 py-1 rounded",
              "bg-red-100 dark:bg-red-900/30"
            )}>
              {userAnswer}
            </span>
          </div>
        </div>

        <div className="flex items-center text-green-500 dark:text-green-400">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <span className="font-medium">正确答案：</span>
            <span className={cn(
              "ml-2 px-2 py-1 rounded",
              "bg-green-100 dark:bg-green-900/30"
            )}>
              {question.answer}
            </span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground">
          <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <span className="font-medium">答题用时：</span>
            <span className="ml-2">{formattedTime} 秒</span>
          </div>
        </div>
      </div>

      {question.hint && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">提示：</span>
            {question.hint}
          </p>
        </div>
      )}
    </div>
  );
}