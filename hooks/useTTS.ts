import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // 初始化并获取中文语音
  useEffect(() => {
    const loadVoices = () => {
      // 确保语音列表已加载
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // 如果语音列表为空，等待加载
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
      }
    };

    loadVoices();
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;

    try {
      // 取消之前的语音
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // 获取中文语音
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices); // 调试用

      // 优先选择中文语音
      const chineseVoice = voices.find(voice => 
        voice.lang.includes('zh') || 
        voice.lang.includes('cmn') ||
        voice.lang.includes('CN')
      );

      if (chineseVoice) {
        console.log('Using Chinese voice:', chineseVoice); // 调试用
        utterance.voice = chineseVoice;
      }

      // 设置语音参数
      utterance.lang = 'zh-CN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // 添加事件监听
      utterance.onstart = () => {
        console.log('Speech started'); // 调试用
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        console.log('Speech ended'); // 调试用
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event); // 调试用
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        
        toast({
          variant: "destructive",
          title: "语音播放失败",
          description: event.error || "请稍后重试",
        });
      };

      // 开始播放
      window.speechSynthesis.speak(utterance);
      console.log('Speech synthesis started'); // 调试用

    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        variant: "destructive",
        title: "语音功能不可用",
        description: "您的浏览器可能不支持语音合成",
      });
    }
  }, [toast]);

  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused
  };
}