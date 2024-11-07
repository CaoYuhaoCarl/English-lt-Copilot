"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Student, Question, TestHistory } from '@/lib/types';
import questionsData from '@/data/questions.json';
import QuestionFilters from './QuestionFilters';
import QuickEntryStats from './QuickEntryStats';
import { Separator } from '@/components/ui/separator';
import ImportFromFile from './ImportFromFile';
import QuickEntryByName from './QuickEntryByName';

interface QuickMistakeEntryProps {
  student: Student;
  students: Student[];
  updateStudentTestHistory: (testHistory: TestHistory) => Promise<void>;
}

export default function QuickMistakeEntry({ 
  student,
  students,
  updateStudentTestHistory 
}: QuickMistakeEntryProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTextbook, setSelectedTextbook] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEntries, setRecentEntries] = useState<Array<{
    date: string;
    student: string;
    count: number;
  }>>([]);
  const [savedCombinations, setSavedCombinations] = useState<Array<{
    name: string;
    questions: number[];
  }>>([]);

  const filteredQuestions = useMemo(() => {
    return questionsData.questions.filter(question => {
      const matchesType = selectedType === 'all' || question.type === selectedType;
      const matchesTextbook = selectedTextbook === 'all' || question.textbook === selectedTextbook;
      const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesTextbook && matchesSearch;
    });
  }, [selectedType, selectedTextbook, searchQuery]);

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };

  const handleSelectByType = (type: string) => {
    const typeQuestions = filteredQuestions.filter(q => q.type === type);
    const typeQuestionIds = typeQuestions.map(q => q.id);
    
    const allTypeSelected = typeQuestionIds.every(id => selectedQuestions.includes(id));
    if (allTypeSelected) {
      setSelectedQuestions(selectedQuestions.filter(id => !typeQuestionIds.includes(id)));
    } else {
      setSelectedQuestions([...new Set([...selectedQuestions, ...typeQuestionIds])]);
    }
  };

  const handleSelectByKeyPoint = (keyPoint: string) => {
    const keyPointQuestions = filteredQuestions.filter(q => q.keyPoint === keyPoint);
    const keyPointQuestionIds = keyPointQuestions.map(q => q.id);
    
    const allKeyPointSelected = keyPointQuestionIds.every(id => 
      selectedQuestions.includes(id)
    );
    
    if (allKeyPointSelected) {
      setSelectedQuestions(selectedQuestions.filter(id => 
        !keyPointQuestionIds.includes(id))
      );
    } else {
      setSelectedQuestions([...new Set([...selectedQuestions, ...keyPointQuestionIds])]);
    }
  };

  const handleSelectByAbility = (ability: string) => {
    const abilityQuestions = filteredQuestions.filter(q => q.ability === ability);
    const abilityQuestionIds = abilityQuestions.map(q => q.id);
    
    const allAbilitySelected = abilityQuestionIds.every(id => 
      selectedQuestions.includes(id)
    );
    
    if (allAbilitySelected) {
      setSelectedQuestions(selectedQuestions.filter(id => 
        !abilityQuestionIds.includes(id))
      );
    } else {
      setSelectedQuestions([...new Set([...selectedQuestions, ...abilityQuestionIds])]);
    }
  };

  const handleSave = async () => {
    if (selectedQuestions.length === 0) {
      alert('请至少选择一道错题');
      return;
    }

    const newTestHistory: TestHistory = {
      id: student.testHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      score: 0,
      details: selectedQuestions.map(questionId => ({
        questionId,
        userAnswer: '',
        isCorrect: false,
        score: 0,
        time: 0
      })),
      type: 'manual_entry'
    };

    try {
      await updateStudentTestHistory(newTestHistory);
      setSelectedQuestions([]);
      
      const typeStats = selectedQuestions.reduce((acc, id) => {
        const question = questionsData.questions.find(q => q.id === id)!;
        acc[question.type] = (acc[question.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statsMessage = Object.entries(typeStats)
        .map(([type, count]) => `${type}: ${count}题`)
        .join('\n');

      alert(`错题记录已保存！\n\n记录统计：\n${statsMessage}`);
    } catch (error) {
      alert('保存失败，请重试');
      console.error(error);
    }
  };

  const handleImport = useCallback((questionIds: number[]) => {
    setSelectedQuestions(prev => [...new Set([...prev, ...questionIds])]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>快速录入错题</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <QuickEntryByName 
          student={student}
          onImport={(questionIds) => {
            setSelectedQuestions([...new Set([...selectedQuestions, ...questionIds])]);
          }}
        />
        
        <Separator className="my-4" />
        
        <QuestionFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedTextbook={selectedTextbook}
          setSelectedTextbook={setSelectedTextbook}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImportFromFile onImport={handleImport} />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedQuestions.length === filteredQuestions.length ? '取消全选' : '全选'}
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            已选择 {selectedQuestions.length} / {filteredQuestions.length} 道题目
          </span>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-accent">
                <Checkbox
                  checked={selectedQuestions.includes(question.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedQuestions([...selectedQuestions, question.id]);
                    } else {
                      setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                    }
                  }}
                />
                <div className="flex flex-col flex-1 cursor-pointer" onClick={() => {
                  if (selectedQuestions.includes(question.id)) {
                    setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                  } else {
                    setSelectedQuestions([...selectedQuestions, question.id]);
                  }
                }}>
                  <span className="text-sm font-medium">{question.question}</span>
                  <span className="text-xs text-muted-foreground">
                    {question.type} | {question.textbook} | {question.keyPoint}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>
            保存错题记录
          </Button>
        </div>

        <QuickEntryStats
          selectedQuestions={selectedQuestions.map(id => 
            filteredQuestions.find(q => q.id === id)!
          )}
          filteredQuestions={filteredQuestions}
          recentEntries={recentEntries}
          savedCombinations={savedCombinations}
          onLoadCombination={(questions) => setSelectedQuestions(questions)}
        />
      </CardContent>
    </Card>
  );
}
