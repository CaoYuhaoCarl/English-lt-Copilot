import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TTSConfig, TTSEngine, TTSVoice } from '@/types/tts';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TTSSettingsProps {
  onTest: () => void;
}

export default function TTSSettings({ onTest }: TTSSettingsProps) {
  const [config, setConfig] = useLocalStorage<TTSConfig>('tts-config', {
    engine: 'speak-tts',
    voice: '',
    rate: 1,
    pitch: 1,
    volume: 1
  });

  const [voices, setVoices] = React.useState<TTSVoice[]>([]);

  // 获取可用的语音列表
  React.useEffect(() => {
    const loadVoices = async () => {
      const availableVoices: TTSVoice[] = [];

      // 浏览器原生语音
      if ('speechSynthesis' in window) {
        const browserVoices = window.speechSynthesis.getVoices();
        browserVoices
          .filter(voice => voice.lang.includes('zh'))
          .forEach(voice => {
            availableVoices.push({
              id: voice.voiceURI,
              name: `${voice.name} (浏览器)`,
              lang: voice.lang,
              engine: 'browser'
            });
          });
      }

      // Speak-TTS 语音
      availableVoices.push({
        id: 'speak-tts-default',
        name: 'Speak TTS (默认)',
        lang: 'zh-CN',
        engine: 'speak-tts'
      });

      // Azure 语音
      const azureVoices = [
        { id: 'zh-CN-XiaoxiaoNeural', name: 'Azure 晓晓' },
        { id: 'zh-CN-YunxiNeural', name: 'Azure 云希' },
        { id: 'zh-CN-YunjianNeural', name: 'Azure 云健' },
      ];
      azureVoices.forEach(voice => {
        availableVoices.push({
          id: voice.id,
          name: voice.name,
          lang: 'zh-CN',
          engine: 'azure'
        });
      });

      setVoices(availableVoices);

      // 如果没有选择过语音，设置默认语音
      if (!config.voice) {
        setConfig(prev => ({
          ...prev,
          voice: availableVoices[0].id
        }));
      }
    };

    loadVoices();
  }, []);

  const handleEngineChange = (engine: TTSEngine) => {
    const engineVoices = voices.filter(v => v.engine === engine);
    setConfig(prev => ({
      ...prev,
      engine,
      voice: engineVoices[0]?.id || ''
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>TTS 引擎</Label>
        <Select
          value={config.engine}
          onValueChange={(value: TTSEngine) => handleEngineChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择 TTS 引擎" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="speak-tts">Speak TTS</SelectItem>
            <SelectItem value="browser">浏览器原生</SelectItem>
            <SelectItem value="azure">Azure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>语音</Label>
        <Select
          value={config.voice}
          onValueChange={(value) => setConfig(prev => ({ ...prev, voice: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择语音" />
          </SelectTrigger>
          <SelectContent>
            {voices
              .filter(voice => voice.engine === config.engine)
              .map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>语速</Label>
          <Slider
            value={[config.rate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, rate: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>音调</Label>
          <Slider
            value={[config.pitch]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, pitch: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>音量</Label>
          <Slider
            value={[config.volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => setConfig(prev => ({ ...prev, volume: value }))}
          />
        </div>
      </div>

      <Button onClick={onTest} className="w-full">
        测试语音
      </Button>
    </div>
  );
} 