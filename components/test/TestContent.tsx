import React from 'react';
import CardMode from './CardMode';
import InputMode from './InputMode';
import TestHeader from './TestHeader';

interface TestContentProps {
  testMode: 'input' | 'card';
  timeLeft: number;
  currentScore: number;
  maxScore: number;
  showEmoji: boolean;
  cardModeProps: any;
  inputModeProps: any;
}

export default function TestContent({
  testMode,
  timeLeft,
  currentScore,
  maxScore,
  showEmoji,
  cardModeProps,
  inputModeProps
}: TestContentProps) {
  return (
    <div className="space-y-4">
      <TestHeader
        timeLeft={timeLeft}
        testMode={testMode}
        currentScore={currentScore}
        maxScore={maxScore}
        showEmoji={showEmoji}
      />
      
      {testMode === 'card' ? (
        <CardMode {...cardModeProps} />
      ) : (
        <InputMode {...inputModeProps} />
      )}
    </div>
  );
} 