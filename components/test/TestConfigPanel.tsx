import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Shuffle, Timer } from 'lucide-react';
import { Question, QuestionType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import questionsData from '@/data/questions.json';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings2 } from 'lucide-react';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { ListChecks, Trophy, Plus, Minus } from 'lucide-react';

interface TestConfigPanelProps {
  questionMode: 'unified' | 'random';
  setQuestionMode: (mode: 'unified' | 'random') => void;
  selectedTypes: QuestionType[];
  handleTypeChange: (type: string, checked: boolean) => void;
  handleCountChange: (type: string, count: number) => void;
  handleScoreChange: (type: string, score: number) => void;
  handleTimeLimitChange: (type: string, timeLimit: number) => void;
  handleMinTimeChange: (type: string, minTime: number) => void;
  testMode: 'input' | 'card';
  setTestMode: (mode: 'input' | 'card') => void;
  startTest: () => void;
  sharedQuestions?: Question[];
  selectedTextbook: string;
  setSelectedTextbook: (textbook: string) => void;
}

interface QuestionData {
  id: number;
  type: string;
  question: string;
  answer: string;
  textbook?: string;
  keyPoint: string;
  ability: string;
  source?: string;
}

export default function TestConfigPanel({
  questionMode,
  setQuestionMode,
  selectedTypes,
  handleTypeChange,
  handleCountChange,
  handleScoreChange,
  handleTimeLimitChange,
  handleMinTimeChange,
  testMode,
  setTestMode,
  startTest,
  sharedQuestions,
  selectedTextbook,
  setSelectedTextbook,
}: TestConfigPanelProps) {
  const textbooks = Array.from(new Set(
    questionsData.questions
      .map((q: QuestionData) => q.textbook || '')
      .filter(textbook => textbook !== '')
  )).sort();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 左侧：题型配置 */}
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {selectedTypes.map((type) => (
            <Card key={type.type} className={cn(
              "transition-all duration-200",
              type.count > 0 ? "ring-2 ring-primary" : "opacity-50"
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{type.type}</CardTitle>
                  <Switch
                    checked={type.count > 0}
                    onCheckedChange={(checked) => handleTypeChange(type.type, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">数量</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountChange(type.type, Math.max(0, type.count - 1))}
                        disabled={type.count === 0}
                      >-</Button>
                      <span className="w-8 text-center">{type.count}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountChange(type.type, type.count + 1)}
                      >+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">分值</Label>
                    <Input
                      type="number"
                      value={type.score}
                      onChange={(e) => handleScoreChange(type.type, parseInt(e.target.value) || 1)}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">时间设置 (秒)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={type.minTime}
                      onChange={(e) => handleMinTimeChange(type.type, parseInt(e.target.value) || 1)}
                      className="w-20 h-9"
                      placeholder="最短"
                    />
                    <span>至</span>
                    <Input
                      type="number"
                      value={type.timeLimit}
                      onChange={(e) => handleTimeLimitChange(type.type, parseInt(e.target.value) || 5)}
                      className="w-20 h-9"
                      placeholder="最长"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 右侧：基础设置和统计 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基础设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>抽题模式</Label>
              <Select value={questionMode} onValueChange={(value) => setQuestionMode(value as 'unified' | 'random')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">随机抽题</SelectItem>
                  <SelectItem value="unified">统一题目</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>测试模式</Label>
              <Select value={testMode} onValueChange={(value) => setTestMode(value as 'input' | 'card')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">输入模式</SelectItem>
                  <SelectItem value="card">翻转卡片</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>教材选择</Label>
              <Select value={selectedTextbook} onValueChange={setSelectedTextbook}>
                <SelectTrigger>
                  <SelectValue placeholder="选择教材" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部教材</SelectItem>
                  {textbooks.map((textbook) => (
                    <SelectItem key={textbook} value={textbook}>
                      {textbook}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">已选题目</span>
                <span className="font-medium">
                  {selectedTypes.reduce((sum, type) => sum + type.count, 0)} 题
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">总分值</span>
                <span className="font-medium">
                  {selectedTypes.reduce((sum, type) => sum + (type.count * type.score), 0)} 分
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">总时长</span>
                <span className="font-medium">
                  {selectedTypes.reduce((sum, type) => sum + (type.count * type.timeLimit), 0)} 秒
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={startTest} className="w-full">
          开始测试
        </Button>
      </div>
    </div>
  );
}