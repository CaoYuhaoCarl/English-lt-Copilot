"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Question } from '@/lib/types';
import { PieChart, BarChart, History, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RecentEntry {
  date: string;
  student: string;
  count: number;
}

interface QuickEntryStatsProps {
  selectedQuestions: Question[];
  filteredQuestions: Question[];
  recentEntries?: RecentEntry[];
  savedCombinations?: Array<{
    name: string;
    questions: number[];
  }>;
  onLoadCombination?: (questions: number[]) => void;
}

export default function QuickEntryStats({
  selectedQuestions,
  filteredQuestions,
  recentEntries = [],
  savedCombinations = [],
  onLoadCombination
}: QuickEntryStatsProps) {
  const typeStats = selectedQuestions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const textbookStats = selectedQuestions.reduce((acc, q) => {
    if (q.textbook) {
      acc[q.textbook] = (acc[q.textbook] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-4 h-4" />
          <span className="font-medium">题型分布</span>
        </div>
        <div className="space-y-2">
          {Object.entries(typeStats).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-sm">{type}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{count}题</span>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{
                      width: `${(count / selectedQuestions.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4" />
          <span className="font-medium">最近录入</span>
        </div>
        <div className="space-y-2">
          {recentEntries.map((entry, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {entry.date} - {entry.student}: {entry.count}题
            </div>
          ))}
          {recentEntries.length === 0 && (
            <div className="text-sm text-muted-foreground">暂无记录</div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4" />
          <span className="font-medium">常用组合</span>
        </div>
        <div className="space-y-2">
          {savedCombinations.map((combo, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onLoadCombination?.(combo.questions)}
              className="w-full justify-between"
            >
              <span>{combo.name}</span>
              <span className="text-muted-foreground">({combo.questions.length}题)</span>
            </Button>
          ))}
          {savedCombinations.length === 0 && (
            <div className="text-sm text-muted-foreground">暂无保存的组合</div>
          )}
        </div>
      </Card>
    </div>
  );
}
