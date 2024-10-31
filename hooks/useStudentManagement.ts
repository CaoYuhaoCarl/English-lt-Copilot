import { useState, useEffect } from 'react';
import { Student, TestHistory, Question } from '@/lib/types';
import studentsData from '@/data/students.json';

export function useStudentManagement() {
  const [students, setStudents] = useState<Student[]>(studentsData.students);
  const [selectedStudentId, setSelectedStudentId] = useState(studentsData.students[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [sharedQuestions, setSharedQuestions] = useState<Question[]>([]);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  useEffect(() => {
    if (isTestStarted) {
      setIsSidebarOpen(false);
    }
  }, [isTestStarted]);

  const updateStudentTestHistory = (newTestHistory: TestHistory) => {
    setStudents(prevStudents => prevStudents.map(s => 
      s.id === selectedStudent.id 
        ? { ...s, testHistory: [...s.testHistory, newTestHistory] } 
        : s
    ));
    setIsTestStarted(false);
  };

  return {
    students,
    setStudents,
    selectedStudent,
    selectedStudentId,
    setSelectedStudentId,
    isSidebarOpen,
    setIsSidebarOpen,
    isTestStarted,
    setIsTestStarted,
    sharedQuestions,
    setSharedQuestions,
    updateStudentTestHistory,
  };
}