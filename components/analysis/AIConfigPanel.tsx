import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings2, ChevronDown } from 'lucide-react';
import { AIAnalysisConfig } from '@/lib/aiTypes';
import { defaultAnalysisConfig } from '@/lib/aiConfig';
import { cn } from '@/lib/utils';

const MODULE_NAMES = {
  errorAnalysis: "错误分析",
  guidance: "启发引导",
  similarQuestions: "练习题",
  keyPointSummary: "知识点",
  abilityImprovement: "能力提升"
};

interface AIConfigPanelProps {
  config: AIAnalysisConfig;
  onConfigChange: (config: AIAnalysisConfig) => void;
}

export default function AIConfigPanel({
  config,
  onConfigChange,
}: AIConfigPanelProps) {
  const [openModule, setOpenModule] = React.useState<string | null>(null);

  const handleToggleModule = (module: keyof AIAnalysisConfig) => {
    const newConfig = {
      ...config,
      [module]: {
        ...config[module],
        enabled: !config[module].enabled,
      },
    };
    onConfigChange(newConfig);
  };

  const handleChange = (
    module: keyof AIAnalysisConfig,
    field: string,
    value: string | number | boolean
  ) => {
    const newConfig = {
      ...config,
      [module]: {
        ...config[module],
        [field]: value,
      },
    };
    onConfigChange(newConfig);
  };

  const resetConfig = () => {
    onConfigChange(defaultAnalysisConfig);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h4 className="font-medium">AI 分析配置</h4>
            <Button variant="ghost" size="sm" onClick={resetConfig}>
              重置默认
            </Button>
          </div>

          <ScrollArea className="h-[600px] pr-4 -mr-4">
            <div className="space-y-4">
              {Object.entries(config).map(([module, settings]) => (
                <Collapsible
                  key={module}
                  open={openModule === module}
                  onOpenChange={(open) => setOpenModule(open ? module : null)}
                >
                  <div 
                    className={cn(
                      "space-y-2 rounded-lg border p-4",
                      !settings.enabled && "opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        {MODULE_NAMES[module as keyof typeof MODULE_NAMES]}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={settings.enabled}
                          onCheckedChange={() => handleToggleModule(module as keyof AIAnalysisConfig)}
                        />
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              openModule === module && "transform rotate-180"
                            )} />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    <CollapsibleContent className="space-y-4">
                      {settings.enabled && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm">分析格式</Label>
                            <Input
                              placeholder="分析格式"
                              value={settings.format}
                              onChange={(e) => handleChange(
                                module as keyof AIAnalysisConfig,
                                'format',
                                e.target.value
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">分析风格</Label>
                            <Input
                              placeholder="分析风格"
                              value={settings.style}
                              onChange={(e) => handleChange(
                                module as keyof AIAnalysisConfig,
                                'style',
                                e.target.value
                              )}
                            />
                          </div>

                          {module === 'similarQuestions' && (
                            <div className="space-y-2">
                              <Label className="text-sm">题目数量</Label>
                              <Input
                                type="number"
                                min={1}
                                max={5}
                                value={settings.count}
                                onChange={(e) => handleChange(
                                  'similarQuestions',
                                  'count',
                                  parseInt(e.target.value) || 1
                                )}
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label className="text-sm">自定义 Prompt</Label>
                            <Textarea
                              placeholder="输入自定义的 AI 提示词..."
                              value={settings.prompt}
                              onChange={(e) => handleChange(
                                module as keyof AIAnalysisConfig,
                                'prompt',
                                e.target.value
                              )}
                              className="min-h-[100px]"
                            />
                          </div>
                        </>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}