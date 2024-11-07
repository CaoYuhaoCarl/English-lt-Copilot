export type TTSEngine = 'browser' | 'speak-tts' | 'azure';

export interface TTSVoice {
  id: string;
  name: string;
  lang: string;
  engine: TTSEngine;
}

export interface TTSConfig {
  engine: TTSEngine;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
} 