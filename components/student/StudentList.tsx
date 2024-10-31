import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from '@/lib/types';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onRemoveStudent: (id: string) => void;
}

export default function StudentList({
  students,
  selectedStudentId,
  onSelectStudent,
  onRemoveStudent,
}: StudentListProps) {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {students.map((student) => (
            <Card
              key={student.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedStudentId === student.id && "border-primary"
              )}
              onClick={() => onSelectStudent(student.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.grade}{student.class}班
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveStudent(student.id);
                    }}
                  >
                    删除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}