'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  id: string | number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VoiceInput({
  id,
  value,
  onChange,
  placeholder = "请输入答案或点击麦克风语音输入",
  className
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const { toast } = useToast();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentIdRef = useRef<string | number>(id);
  const transcriptRef = useRef('');

  // 当 id 改变时重置状态
  useEffect(() => {
    if (currentIdRef.current !== id) {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
      setIsListening(false);
      setIsLoading(false);
      setInterimTranscript('');
      currentIdRef.current = id;
      recognitionRef.current = null;
    }
  }, [id, isListening]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const initializeRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('Browser does not support speech recognition');
        return null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsLoading(false);
        transcriptRef.current = value || '';
        toast({
          title: "语音识别已开启",
          description: "请开始说话，说完后点击麦克风图标结束",
          duration: 3000,
        });
      };

      recognition.onerror = (event) => {
        if (event.error === 'aborted' && !isListening) return;
        if (event.error === 'no-speech') return;

        setIsListening(false);
        setIsLoading(false);
        
        const errorMessages: Record<string, string> = {
          'not-allowed': "请允许使用麦克风",
          'network': "网络连接出错",
          'aborted': "语音识别已取消",
          'no-speech': "未检测到语音",
          'audio-capture': "未找到麦克风设备",
        };
        
        toast({
          title: "错误",
          description: errorMessages[event.error] || "语音识别出错",
          variant: "destructive",
          duration: 3000,
        });
      };

      recognition.onend = () => {
        // 只有在当前 id 匹配时才处理结束事件
        if (currentIdRef.current === id) {
          if (!isListening) {
            setIsListening(false);
            setIsLoading(false);
            setInterimTranscript('');
          } else {
            try {
              recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              setIsListening(false);
              setIsLoading(false);
            }
          }
        }
      };

      recognition.onresult = (event) => {
        // 确保结果属于当前输入框
        if (currentIdRef.current === id) {
          let interim = '';
          let final = transcriptRef.current;
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final = transcript.trim();
              transcriptRef.current = final;
              onChange(final);
            } else {
              interim += transcript;
            }
          }
          
          setInterimTranscript(interim);
        }
      };

      return recognition;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      toast({
        title: "错误",
        description: "初始化语音识别失败",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }
  }, [id, isListening, toast, value, onChange]);

  const toggleListening = useCallback(() => {
    // 确保是在当前输入框的上下文中
    if (currentIdRef.current !== id) {
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (!recognitionRef.current) {
      toast({
        title: "错误",
        description: "您的浏览器不支持语音识别",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      try {
        recognitionRef.current.stop();
        toast({
          title: "语音识别已结束",
          description: "已完成录入",
          duration: 2000,
        });
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    } else {
      setIsLoading(true);
      transcriptRef.current = value;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsLoading(false);
        toast({
          title: "错误",
          description: "启动语音识别失败，请重试",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [id, isListening, toast, value, initializeRecognition]);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="relative flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "text-lg rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-2",
            isListening && "border-primary",
            className
          )}
        />
        <Button
          type="button"
          variant={isListening ? "destructive" : "secondary"}
          size="icon"
          className={cn(
            "flex-shrink-0 h-12 w-12 rounded-full",
            "transition-all duration-200 ease-spring",
            isListening && "animate-pulse shadow-lg"
          )}
          onClick={toggleListening}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isListening && interimTranscript && (
        <div className="text-sm text-muted-foreground animate-pulse pl-4 border-l-2 border-primary">
          正在识别: {interimTranscript}
        </div>
      )}
    </div>
  );
}