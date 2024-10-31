'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/lib/types';
import QuestionCard from './QuestionCard';
import ProgressIndicator from './ProgressIndicator';

interface CardModeProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  currentQuestions: Question[];
  flippedCards: Record<number, boolean>;
  handleAnswerChange: (id: number, value: boolean) => void;
}

export default function CardMode({
  currentQuestion,
  currentQuestionIndex,
  currentQuestions,
  flippedCards,
  handleAnswerChange,
}: CardModeProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState(currentQuestion);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    if (currentQuestion.id !== displayedQuestion.id) {
      setSlideDirection(currentQuestionIndex > currentQuestions.findIndex(q => q.id === displayedQuestion.id) ? 'left' : 'right');
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayedQuestion(currentQuestion);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 30);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, displayedQuestion.id, currentQuestionIndex, currentQuestions]);

  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <ProgressIndicator 
        currentIndex={currentQuestionIndex}
        totalQuestions={currentQuestions.length}
      />

      <div className="absolute top-4 right-4 text-sm font-medium">
        {currentQuestionIndex + 1} / {currentQuestions.length}
      </div>

      <div 
        className={cn(
          "w-full max-w-3xl transition-transform duration-100",
          isTransitioning && slideDirection === 'left' && "translate-x-[-100%] opacity-0",
          isTransitioning && slideDirection === 'right' && "translate-x-[100%] opacity-0",
          !isTransitioning && "translate-x-0 opacity-100"
        )}
      >
        <QuestionCard
          question={displayedQuestion}
          isFlipped={flippedCards[displayedQuestion.id]}
          onAnswer={handleAnswerChange}
        />
      </div>

      <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
        {currentQuestions.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-100',
              index === currentQuestionIndex
                ? 'w-4 bg-primary'
                : index < currentQuestionIndex
                ? 'bg-primary/50'
                : 'bg-gray-300 dark:bg-gray-700'
            )}
          />
        ))}
      </div>
    </div>
  );
}