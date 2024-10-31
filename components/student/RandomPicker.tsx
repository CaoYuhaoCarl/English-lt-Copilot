import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shuffle, RotateCcw } from 'lucide-react';
import { Student } from '@/lib/types';
import { useRandomPicker } from '@/hooks/useRandomPicker';
import { cn } from '@/lib/utils';

interface RandomPickerProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
}

export default function RandomPicker({
  students,
  onSelectStudent,
}: RandomPickerProps) {
  const {
    shownStudents,
    remainingStudents,
    pickRandomStudent,
    resetPicker,
  } = useRandomPicker(students);

  const handleRandomPick = () => {
    const pickedStudent = pickRandomStudent();
    if (pickedStudent) {
      onSelectStudent(pickedStudent.id);
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        当前筛选条件下没有学生
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-400px)]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          已抽取: {shownStudents.length}/{students.length}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetPicker}
            disabled={shownStudents.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button
            size="sm"
            onClick={handleRandomPick}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {remainingStudents.length === 0 ? '重新开始' : '随机抽取'}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-2">
          {students
            .filter(student => shownStudents.includes(student.id))
            .map((student, index) => (
              <Card
                key={student.id}
                className={cn(
                  "cursor-pointer transition-all",
                  "hover:shadow-md hover:border-primary/50",
                  "animate-in fade-in-0 slide-in-from-bottom-2"
                )}
                onClick={() => onSelectStudent(student.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.grade}{student.class}班
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      #{shownStudents.indexOf(student.id) + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}