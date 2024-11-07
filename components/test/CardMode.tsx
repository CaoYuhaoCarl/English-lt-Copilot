'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/lib/types';
import QuestionCard from './QuestionCard';
import AnimatedProgress from './AnimatedProgress';

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
  const [localFlippedCards, setLocalFlippedCards] = useState(flippedCards);

  useEffect(() => {
    if (!isTransitioning) {
      setLocalFlippedCards(flippedCards);
    }
  }, [flippedCards, isTransitioning]);

  useEffect(() => {
    if (currentQuestion.id !== displayedQuestion.id) {
      setSlideDirection(currentQuestionIndex > currentQuestions.findIndex(q => q.id === displayedQuestion.id) ? 'left' : 'right');
      setIsTransitioning(true);
      
      const hideTimer = setTimeout(() => {
        setLocalFlippedCards({});
        setDisplayedQuestion(currentQuestion);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 200);
      
      return () => clearTimeout(hideTimer);
    }
  }, [currentQuestion, displayedQuestion.id, currentQuestionIndex, currentQuestions]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-12rem)] justify-start items-center pt-24">
      <div className="absolute top-0 left-0 right-0 px-4">
        <AnimatedProgress 
          value={currentQuestionIndex + 1}
          max={currentQuestions.length}
        />
      </div>

      <div className="absolute top-8 right-4 text-sm font-medium">
        {currentQuestionIndex + 1} / {currentQuestions.length}
      </div>

      <div 
        className={cn(
          "w-full max-w-3xl px-4 transition-all duration-300",
          isTransitioning && slideDirection === 'left' && "-translate-x-full opacity-0",
          isTransitioning && slideDirection === 'right' && "translate-x-full opacity-0",
          !isTransitioning && "translate-x-0 opacity-100"
        )}
      >
        <QuestionCard
          question={displayedQuestion}
          isFlipped={localFlippedCards[displayedQuestion.id]}
          onAnswer={handleAnswerChange}
        />
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
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