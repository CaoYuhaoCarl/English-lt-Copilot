import { useState, useCallback, useRef, useEffect } from 'react';
import Speech from 'speak-tts';
import { useToast } from '@/components/ui/use-toast';

export function useSpeakTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const speechRef = useRef<Speech | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const speech = new Speech();
    
    speech.init({
      volume: 1,
      lang: 'zh-CN',
      rate: 1,
      pitch: 1,
      splitSentences: true,
    }).then(() => {
      speechRef.current = speech;
      setIsInitialized(true);
    }).catch((e) => {
      console.error('Speak-TTS初始化失败:', e);
      toast({
        variant: "destructive",
        title: "语音功能初始化失败",
        description: "请检查浏览器设置或使用其他浏览器",
      });
    });

    return () => {
      if (speechRef.current) {
        speechRef.current.cancel();
      }
    };
  }, [toast]);

  const speak = useCallback((text: string) => {
    if (!isInitialized || !speechRef.current) return;

    try {
      speechRef.current.cancel();
      
      speechRef.current.speak({
        text,
        queue: false,
        listeners: {
          onstart: () => {
            setIsSpeaking(true);
            setIsPaused(false);
          },
          onend: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
          onerror: (error) => {
            console.error('TTS错误:', error);
            setIsSpeaking(false);
            setIsPaused(false);
            toast({
              variant: "destructive",
              title: "语音播放失败",
              description: "请稍后重试",
            });
          },
        }
      });
    } catch (error) {
      console.error('TTS错误:', error);
      toast({
        variant: "destructive",
        title: "语音功能不可用",
        description: "您的浏览器可能不支持语音合成",
      });
    }
  }, [isInitialized, toast]);

  const pause = useCallback(() => {
    if (speechRef.current && isSpeaking) {
      speechRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (speechRef.current && isPaused) {
      speechRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (speechRef.current) {
      speechRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isInitialized
  };
} 