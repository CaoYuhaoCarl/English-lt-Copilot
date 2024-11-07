'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/useTTS';
import TTSButton from '@/components/analysis/TTSButton';

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
  const [clickedButton, setClickedButton] = useState<'know' | 'unknown' | null>(null);
  const { speak, isSpeaking, isPaused, pause, resume, stop } = useTTS();

  // 添加键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFlipped) return; // 如果卡片已翻转则不响应

      if (e.key === 'ArrowLeft') {
        setClickedButton('know');
        onAnswer(question.id, true);
      } else if (e.key === 'ArrowRight') {
        setClickedButton('unknown');
        onAnswer(question.id, false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, onAnswer, question.id]);

  // 监听翻转状态变化
  useEffect(() => {
    if (isFlipped) {
      // 添加短暂延迟,等待翻转动画开始后再朗读
      const timer = setTimeout(() => {
        speak(question.answer);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // 卡片翻回正面时停止朗读
      stop();
    }
  }, [isFlipped, question.answer, speak, stop]);

  // 手动朗读按钮处理函数
  const handleTTS = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(question.answer);
    }
  };

  // 组件卸载时停止朗读
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // 添加新的样式类
  const cardStyles = {
    wrapper: "relative w-full max-w-2xl mx-auto perspective-1000",
    inner: cn(
      "relative w-full h-full transition-transform duration-700",
      "transform-style-preserve-3d hover:shadow-xl",
      isFlipped && "rotate-y-180"
    ),
    face: "absolute w-full h-full backface-hidden rounded-xl",
    front: "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70",
    back: cn(
      "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70",
      "rotate-y-180"
    ),
    content: "p-8 space-y-8",
    header: "flex items-center justify-between",
    question: "text-5xl font-medium text-center py-12 leading-relaxed",
    buttons: "flex justify-center gap-8",
  };

  return (
    <div className={cardStyles.wrapper}>
      <div className={cardStyles.inner}>
        {/* 正面 */}
        <div className={cn(cardStyles.face, cardStyles.front)}>
          <div className={cardStyles.content}>
            <div className={cardStyles.header}>
              <Badge variant="outline" className="text-lg px-4 py-2">{question.type}</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">{question.score}分</Badge>
            </div>

            <div className={cardStyles.question}>
              {question.question}
            </div>

            <div className={cardStyles.buttons}>
              <Button
                onClick={() => onAnswer(question.id, true)}
                disabled={isFlipped}
                className={cn(
                  "h-16 px-12 text-xl gap-3",
                  "transform hover:scale-105 active:scale-95",
                  "transition-all duration-300 ease-out",
                  "bg-primary/90 hover:bg-primary text-primary-foreground",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                <CheckCircle2 className="w-6 h-6" />
                会呢
              </Button>
              <Button
                onClick={() => onAnswer(question.id, false)}
                disabled={isFlipped}
                className={cn(
                  "h-16 px-12 text-xl gap-3",
                  "transform hover:scale-105 active:scale-95",
                  "transition-all duration-300 ease-out",
                  "bg-secondary/90 hover:bg-secondary text-secondary-foreground",
                  "shadow-lg hover:shadow-xl"
                )}
              >
                <XCircle className="w-6 h-6" />
                不会
              </Button>
            </div>
          </div>
        </div>

        {/* 背面 */}
        <div className={cn(cardStyles.face, cardStyles.back)}>
          <div className={cardStyles.content}>
            <div className={cardStyles.header}>
              <Badge variant="outline" className="text-lg px-4 py-2">答案</Badge>
              <TTSButton
                onClick={handleTTS}
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                className="scale-125"
              />
            </div>
            <div className={cardStyles.question}>
              {question.answer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}