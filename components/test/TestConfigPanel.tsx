import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Shuffle, Timer } from 'lucide-react';
import { Question, QuestionType } from '@/lib/types';

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
}: TestConfigPanelProps) {
  return (
    <div>
      <div className="mb-4">
        <Label>抽题模式</Label>
        <RadioGroup
          value={questionMode}
          onValueChange={(value) => setQuestionMode(value as 'unified' | 'random')}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unified" id="unified" />
            <Label htmlFor="unified">统考</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="random" id="random" />
            <Label htmlFor="random">随机</Label>
          </div>
        </RadioGroup>
        {questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            使用统一试题进行测评
          </div>
        )}
      </div>

      <div className="mb-4">
        <Label>选择题型、数量、分值和时间设置</Label>
        <div className="space-y-2 mt-2">
          {selectedTypes.map((type) => (
            <div key={type.type} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={type.type}
                  checked={type.count > 0}
                  onCheckedChange={(checked) => handleTypeChange(type.type, checked === true)}
                  disabled={questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0}
                />
                <label htmlFor={type.type} className="flex-grow">{type.type}</label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-6">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={type.count}
                    onChange={(e) => handleCountChange(type.type, parseInt(e.target.value) || 0)}
                    className="w-16"
                    min="0"
                    disabled={questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0}
                  />
                  <span>题</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={type.score}
                    onChange={(e) => handleScoreChange(type.type, parseInt(e.target.value) || 1)}
                    className="w-16"
                    min="1"
                    disabled={questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0}
                  />
                  <span>分/题</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={type.timeLimit}
                    onChange={(e) => handleTimeLimitChange(type.type, parseInt(e.target.value) || 5)}
                    className="w-16"
                    min="5"
                    disabled={questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0}
                  />
                  <span>秒限</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={type.minTime}
                    onChange={(e) => handleMinTimeChange(type.type, parseInt(e.target.value) || 1)}
                    className="w-16"
                    min="1"
                    max={type.timeLimit}
                    disabled={questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0}
                  />
                  <span>秒短</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label>测试模式</Label>
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inputMode"
              checked={testMode === 'input'}
              onCheckedChange={(checked) => checked && setTestMode('input')}
            />
            <label htmlFor="inputMode">输入</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cardMode"
              checked={testMode === 'card'}
              onCheckedChange={(checked) => checked && setTestMode('card')}
            />
            <label htmlFor="cardMode">翻转</label>
          </div>
        </div>
      </div>

      <Button onClick={startTest} className="flex items-center gap-2">
        <Shuffle className="w-4 h-4" />
        开始测试
      </Button>
    </div>
  );
}