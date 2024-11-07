import { useCallback } from 'react';

export function useAzureTTS() {
  return {
    speak: useCallback(() => {}, []),
    pause: useCallback(() => {}, []),
    resume: useCallback(() => {}, []),
    stop: useCallback(() => {}, []),
    isSpeaking: false,
    isPaused: false
  };
} 