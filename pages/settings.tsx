import TTSSettings from '@/components/settings/TTSSettings';
import { useTTS } from '@/hooks/useTTS';

export default function SettingsPage() {
  const { speak } = useTTS();

  const handleTestTTS = () => {
    speak('这是一段测试语音，用于测试语音合成效果。');
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">语音设置</h2>
          <TTSSettings onTest={handleTestTTS} />
        </div>
      </div>
    </div>
  );
} 