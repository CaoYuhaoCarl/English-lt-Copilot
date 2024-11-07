'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  max: number;
}

export default function AnimatedProgress({ value, max }: AnimatedProgressProps) {
  const progress = (value / max) * 100;
  
  return (
    <div className="relative w-full h-6">
      {/* 背景轨道 */}
      <div className="absolute inset-0 bg-secondary/20 rounded-full" />
      
      {/* 进度条 */}
      <div 
        className="absolute h-full bg-primary/20 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      
      {/* 乌龟容器 */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{ left: `${progress}%` }}
      >
        {/* 乌龟图标 */}
        <div className={cn(
          "-ml-4 w-8 h-8",
          "animate-walk"
        )}>
          <span className="text-2xl" role="img" aria-label="turtle">
            🐿
          </span>
        </div>
      </div>
    </div>
  );
} 