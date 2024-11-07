'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from '@/lib/types';
import { useStudentFilters } from '@/hooks/useStudentFilters';
import StudentFilters from './student/StudentFilters';
import StudentList from './student/StudentList';
import RandomPicker from './student/RandomPicker';
import { ListFilter, Shuffle } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function StudentManagementPanel({
  students,
  selectedStudentId,
  setSelectedStudentId,
  setStudents,
}: StudentListProps) {
  const [displayMode, setDisplayMode] = useState<'list' | 'random'>('list');
  const {
    filters,
    updateFilter,
    filteredStudents,
    grades,
    classes,
  } = useStudentFilters(students);

  const handleRemoveStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    if (id === selectedStudentId && students.length > 1) {
      setSelectedStudentId(students[0].id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>学生管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 overflow-hidden">
        <StudentFilters
          filters={filters}
          onFilterChange={updateFilter}
          grades={grades}
          classes={classes}
        />

        <Tabs value={displayMode} onValueChange={(value: 'list' | 'random') => setDisplayMode(value)} className="flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListFilter className="w-4 h-4" />
              列表显示
            </TabsTrigger>
            <TabsTrigger value="random" className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              随机抽取
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4 flex-1 overflow-auto">
            <StudentList
              students={filteredStudents}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onRemoveStudent={handleRemoveStudent}
            />
          </TabsContent>

          <TabsContent value="random" className="mt-4 flex-1">
            <RandomPicker
              students={filteredStudents}
              onSelectStudent={setSelectedStudentId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}