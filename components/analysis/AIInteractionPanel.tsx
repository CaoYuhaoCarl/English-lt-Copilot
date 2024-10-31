'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIInteractionPanelProps {
  questionContext: string;
  analysisResult: any;
  onSendMessage: (message: string) => Promise<string>;
  conversationHistory: Array<{ role: string; content: string }>;
  onClearHistory: () => void;
  className?: string;
}

export default function AIInteractionPanel({
  onSendMessage,
  conversationHistory,
  onClearHistory,
  className
}: AIInteractionPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(
      conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    );
  }, [conversationHistory]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if the event exists and has the key property
    if (e && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-[300px] border rounded-lg", className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">AI 互动</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={messages.length === 0}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          清除历史
        </Button>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              message.role === 'user'
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted"
            )}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入你的问题..."
            className="min-h-[60px]"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="px-8"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}