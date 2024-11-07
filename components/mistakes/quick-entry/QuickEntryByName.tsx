import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import questionsData from '@/data/questions.json';
import { Student } from '@/lib/types';

interface QuickEntryByNameProps {
  student: Student;
  onImport: (questionIds: number[]) => void;
}

export default function QuickEntryByName({ student, onImport }: QuickEntryByNameProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      // 格式：单词15,16 短语23,24
      const parts = input.trim().split(/\s+/);
      if (parts.length === 0) {
        throw new Error('请输入题号');
      }

      // 解析题目
      const questionIds: number[] = [];
      for (const part of parts) {
        const typeAndNumbers = part.match(/^(\D+)(\d+(?:,\d+)*)$/);
        if (!typeAndNumbers) continue;

        const [, type, numbers] = typeAndNumbers;
        const numberList = numbers.split(',').map(Number);

        // 查找对应类型的题目
        const typeQuestions = questionsData.questions.filter(q => q.type === type);
        numberList.forEach(num => {
          const question = typeQuestions[num - 1];
          if (question) {
            questionIds.push(question.id);
          }
        });
      }

      if (questionIds.length === 0) {
        throw new Error('未找到任何匹配的题目');
      }

      onImport(questionIds);
      setInput('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '输入格式错误');
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="text-sm mb-2">
          当前学生：<span className="font-medium">{student.name}</span>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例：单词15,16 短语23,24"
            className="flex-1"
          />
          <Button onClick={handleSubmit}>录入</Button>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div className="text-sm text-muted-foreground">
          <p>使用说明：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>输入格式：题型题号[,题号]</li>
            <li>多个题型用空格分隔</li>
            <li>同一题型的多个题号用逗号分隔</li>
            <li>例：单词15,16 短语23,24</li>
          </ul>
        </div>
      </div>
    </Card>
  );
} 