import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  className?: string;
}

export default function ScoreDisplay({ score, maxScore, className }: ScoreDisplayProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center",
        "font-bold text-2xl",
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        key={score}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent"
      >
        {score}
      </motion.span>
      <span className="text-muted-foreground text-lg mx-1">/</span>
      <span className="text-muted-foreground text-lg">{maxScore}</span>
    </motion.div>
  );
}