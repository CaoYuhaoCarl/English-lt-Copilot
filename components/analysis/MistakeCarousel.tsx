'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '@/lib/utils';
import AIAnalysisCard from './AIAnalysisCard';
import { Question, TestDetail, TestHistory } from '@/lib/types';

interface MistakeCarouselProps {
  mistakes: Array<{
    test: TestHistory;
    detail: TestDetail;
    question: Question;
  }>;
  isLoading: Record<string, boolean>;
  analysisResults: Record<string, any>;
  onAnalyze: (question: Question, detail: TestDetail, testId: number) => void;
  onAddInteraction: (key: string, message: { role: string; content: string }) => void;
}

export default function MistakeCarousel({
  mistakes,
  isLoading,
  analysisResults,
  onAnalyze,
  onAddInteraction
}: MistakeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        暂无错题记录
      </div>
    );
  }

  if (mistakes.length === 1) {
    const { test, detail, question } = mistakes[0];
    return (
      <AIAnalysisCard
        question={question}
        detail={detail}
        testId={test.id}
        isLoading={isLoading[`${test.id}-${detail.questionId}`]}
        analysisResult={analysisResults[`${test.id}-${detail.questionId}`]}
        onAnalyze={() => onAnalyze(question, detail, test.id)}
        onAddInteraction={(message) => onAddInteraction(`${test.id}-${detail.questionId}`, message)}
      />
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {mistakes.map(({ test, detail, question }) => (
            <div 
              key={`${test.id}-${detail.questionId}`}
              className="flex-[0_0_100%] min-w-0"
            >
              <AIAnalysisCard
                question={question}
                detail={detail}
                testId={test.id}
                isLoading={isLoading[`${test.id}-${detail.questionId}`]}
                analysisResult={analysisResults[`${test.id}-${detail.questionId}`]}
                onAnalyze={() => onAnalyze(question, detail, test.id)}
                onAddInteraction={(message) => 
                  onAddInteraction(`${test.id}-${detail.questionId}`, message)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "transition-opacity duration-200",
          !canScrollPrev && "opacity-0 pointer-events-none"
        )}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "transition-opacity duration-200",
          !canScrollNext && "opacity-0 pointer-events-none"
        )}
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}