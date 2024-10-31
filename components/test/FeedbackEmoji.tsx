import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Medal, PartyPopper, Smile, Laugh } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackEmojiProps {
  score: number;
  maxScore: number;
  show: boolean;
  className?: string;
}

export default function FeedbackEmoji({ score, maxScore, show, className }: FeedbackEmojiProps) {
  const percentage = (score / maxScore) * 100;
  
  const getEmoji = () => {
    if (percentage < 60) return null;
    if (percentage < 65) return <Smile className="w-8 h-8 text-yellow-500" />;
    if (percentage < 70) return <Laugh className="w-8 h-8 text-yellow-500" />;
    if (percentage < 75) return <PartyPopper className="w-8 h-8 text-yellow-500" />;
    if (percentage < 80) return <Star className="w-8 h-8 text-yellow-500" />;
    if (percentage < 85) return <Trophy className="w-8 h-8 text-yellow-500" />;
    return <Medal className="w-8 h-8 text-yellow-500" />;
  };

  const getMessage = () => {
    if (percentage < 60) return "继续加油！";
    if (percentage < 70) return "不错哦！";
    if (percentage < 80) return "做得很棒！";
    if (percentage < 90) return "太厉害了！";
    return "完美表现！";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={cn(
            "flex items-center gap-2",
            "transition-all duration-300",
            className
          )}
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            {getEmoji()}
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-yellow-600 dark:text-yellow-400"
          >
            {getMessage()}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}