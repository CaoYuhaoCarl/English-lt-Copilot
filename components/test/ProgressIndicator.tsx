import React from 'react';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalQuestions: number;
}

export default function ProgressIndicator({
  currentIndex,
  totalQuestions,
}: ProgressIndicatorProps) {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ 
            width: `${((currentIndex + 1) / totalQuestions) * 100}%` 
          }}
        />
      </div>
    </>
  );
}