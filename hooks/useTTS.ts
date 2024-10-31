import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 1000;

    const loadVoices = () => {
      try {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          throw new Error('Speech synthesis not available');
        }

        const availableVoices = window.speechSynthesis.getVoices();

        if (availableVoices.length === 0) {
          if (retryCount < maxRetries) {
            retryCount++;
            initTimeoutRef.current = setTimeout(loadVoices, retryDelay);
            return;
          }
          throw new Error('No voices available');
        }

        const chineseVoice = availableVoices.find(voice => 
          voice.lang.includes('zh') || voice.lang.includes('cmn')
        );
        const englishVoice = availableVoices.find(voice => 
          voice.lang.includes('en')
        );
        
        setVoices(availableVoices);
        setSelectedVoice(chineseVoice || englishVoice || availableVoices[0]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading voices:', error);
        toast({
          variant: "destructive",
          title: "语音加载失败",
          description: error instanceof Error ? error.message : "无法加载语音合成声音",
        });
      }
    };

    // Initial load attempt
    loadVoices();

    // Set up voice change listener
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (utteranceRef.current) {
        try {
          window.speechSynthesis?.cancel();
        } catch (error) {
          console.error('Error cleaning up speech synthesis:', error);
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [toast]);

  const speak = useCallback((text: string) => {
    if (!text || !isInitialized || typeof window === 'undefined') return;

    try {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);
      
      utterance.onerror = (event) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          return;
        }

        console.error('TTS Error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;

        const errorMessages: Record<string, string> = {
          'not-allowed': "请允许使用语音功能",
          'network': "网络连接出错",
          'synthesis-unavailable': "语音合成不可用",
          'language-unavailable': "所选语言不可用",
          'no-voice-available': "没有可用的语音",
        };
        
        toast({
          variant: "destructive",
          title: "语音播放失败",
          description: errorMessages[event.error] || "请稍后重试",
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        variant: "destructive",
        title: "语音功能不可用",
        description: "您的浏览器可能不支持语音合成",
      });
    }
  }, [selectedVoice, isInitialized, toast]);

  const pause = useCallback(() => {
    if (utteranceRef.current && isSpeaking && typeof window !== 'undefined') {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch (error) {
        console.error('Error pausing speech:', error);
      }
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (utteranceRef.current && isPaused && typeof window !== 'undefined') {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch (error) {
        console.error('Error resuming speech:', error);
      }
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (utteranceRef.current && typeof window !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
      } catch (error) {
        console.error('Error stopping speech:', error);
      }
    }
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    setVoice,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    isInitialized,
  };
}