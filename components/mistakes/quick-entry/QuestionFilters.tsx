"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import questionsData from '@/data/questions.json';

interface QuestionFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTextbook: string;
  setSelectedTextbook: (textbook: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function QuestionFilters({
  selectedType,
  setSelectedType,
  selectedTextbook,
  setSelectedTextbook,
  searchQuery,
  setSearchQuery
}: QuestionFiltersProps) {
  // 获取所有唯一的题目类型和教材
  const types = Array.from(new Set(questionsData.questions.map(q => q.type)));
  const textbooks = Array.from(new Set(questionsData.questions.map(q => q.textbook).filter(Boolean)));

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="w-[200px]">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="选择题目类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select value={selectedTextbook} onValueChange={setSelectedTextbook}>
          <SelectTrigger>
            <SelectValue placeholder="选择教材" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部教材</SelectItem>
            {textbooks.map(book => (
              <SelectItem key={book} value={book}>{book}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Input
          placeholder="搜索题目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
