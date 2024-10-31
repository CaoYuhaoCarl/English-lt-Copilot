import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TTSButtonProps {
  onClick: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  className?: string;
}

export default function TTSButton({
  onClick,
  isSpeaking,
  isPaused,
  className
}: TTSButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "relative",
        isSpeaking && "text-primary",
        className
      )}
    >
      {!isSpeaking && <Volume2 className="h-5 w-5" />}
      {isSpeaking && isPaused && <Play className="h-5 w-5" />}
      {isSpeaking && !isPaused && <Pause className="h-5 w-5" />}
      
      {/* 动画波纹效果 */}
      {isSpeaking && !isPaused && (
        <>
          <span className="absolute inset-0 animate-ping-slow rounded-full bg-primary/20" />
          <span className="absolute inset-2 animate-ping-slow animation-delay-150 rounded-full bg-primary/20" />
        </>
      )}
    </Button>
  );
}