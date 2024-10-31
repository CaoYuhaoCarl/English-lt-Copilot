import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface FeedbackMessageProps {
  message: string;
  show: boolean;
  isCorrect: boolean;
  className?: string;
}

export default function FeedbackMessage({ message, show, isCorrect, className }: FeedbackMessageProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          <Alert
            variant={isCorrect ? "default" : "destructive"}
            className={cn(
              "border-2",
              isCorrect ? "border-green-500" : "border-red-500"
            )}
          >
            <AlertDescription className="text-xl text-center font-medium">
              {message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}