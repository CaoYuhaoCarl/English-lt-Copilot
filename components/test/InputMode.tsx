import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from '@/lib/types';
import VoiceInput from './VoiceInput';
import { Timer, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputModeProps {
  questions: Question[];
  answers: Record<number, { value: string | boolean; time: number; score: number; }>;
  handleAnswerChange: (id: number, value: string) => void;
  handleSubmit: () => void;
}

export default function InputMode({
  questions,
  answers,
  handleAnswerChange,
  handleSubmit,
}: InputModeProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const navigateToQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && !isFirstQuestion) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && !isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getCompletionStatus = () => {
    const answeredCount = Object.keys(answers).length;
    return {
      count: answeredCount,
      total: totalQuestions,
      percentage: (answeredCount / totalQuestions) * 100
    };
  };

  const status = getCompletionStatus();

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                第 {currentIndex + 1} 题
              </span>
              <span className="px-2 py-1 bg-secondary rounded text-sm">
                {currentQuestion.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>{currentQuestion.timeLimit}秒</span>
              <span className="mx-2">•</span>
              <span>{currentQuestion.score}分</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xl leading-relaxed">{currentQuestion.question}</p>
          </div>

          <VoiceInput
            id={currentQuestion.id}
            value={(answers[currentQuestion.id]?.value as string) || ''}
            onChange={(value) => handleAnswerChange(currentQuestion.id, String(value))}
            placeholder="请输入答案或点击麦克风语音输入"
            className="text-lg"
          />
        </div>
      </Card>

      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigateToQuestion('prev')}
          disabled={isFirstQuestion}
          className={cn(
            "w-[100px] transition-all duration-200",
            isFirstQuestion && "opacity-50"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一题
        </Button>

        <div className="flex-1 flex justify-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            className={cn(
              "min-w-[200px] transition-all duration-300",
              status.percentage === 100 && "bg-green-600 hover:bg-green-700"
            )}
          >
            <Send className="w-4 h-4 mr-2" />
            {status.percentage === 100 ? '提交答案' : '继续答题'}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => navigateToQuestion('next')}
          disabled={isLastQuestion}
          className={cn(
            "w-[100px] transition-all duration-200",
            isLastQuestion && "opacity-50"
          )}
        >
          下一题
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {questions.map((_, index) => {
          const isAnswered = answers[questions[index].id]?.value;
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                isAnswered ? "bg-primary" : "bg-secondary",
                isCurrent && "ring-2 ring-primary ring-offset-2",
                "hover:opacity-80"
              )}
              aria-label={`跳转到第 ${index + 1} 题`}
            />
          );
        })}
      </div>
    </div>
  );
}