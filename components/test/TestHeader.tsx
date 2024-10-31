import React from 'react';
import { Label } from "@/components/ui/label";
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import ScoreDisplay from './ScoreDisplay';
import FeedbackEmoji from './FeedbackEmoji';
import { cn } from '@/lib/utils';

interface TestHeaderProps {
  timeLeft: number;
  testMode: 'input' | 'card';
  currentScore: number;
  maxScore: number;
  showEmoji: boolean;
}

export default function TestHeader({
  timeLeft,
  testMode,
  currentScore,
  maxScore,
  showEmoji,
}: TestHeaderProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <Label className="text-sm text-muted-foreground">剩余时间</Label>
          <motion.div
            key={timeLeft}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 text-lg font-bold",
              timeLeft <= 30 && "text-red-500"
            )}
          >
            <Timer className="w-4 h-4" />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>
        </div>
      </div>

      {testMode === 'card' && (
        <div className="flex items-center gap-4">
          <ScoreDisplay score={currentScore} maxScore={maxScore} />
          <FeedbackEmoji 
            score={currentScore}
            maxScore={maxScore}
            show={showEmoji}
          />
        </div>
      )}
    </div>
  );
}