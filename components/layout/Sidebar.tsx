import React from 'react';
import { cn } from '@/lib/utils';
import StudentList from '../StudentList';
import { Student } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function Sidebar({
  isOpen,
  students,
  selectedStudentId,
  setSelectedStudentId,
  setStudents,
}: SidebarProps) {
  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-in-out",
        "bg-background border-r shadow-lg overflow-hidden",
        isOpen ? 'w-64' : 'w-0'
      )}
    >
      <StudentList 
        students={students}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        setStudents={setStudents}
      />
    </div>
  );
}