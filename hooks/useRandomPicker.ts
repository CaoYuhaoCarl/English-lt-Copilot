import { useState, useCallback, useMemo } from 'react';
import { Student } from '@/lib/types';

export function useRandomPicker(students: Student[]) {
  // 使用持久化的状态来存储已显示的学生
  const [shownStudents, setShownStudents] = useState<string[]>([]);

  const remainingStudents = useMemo(() => {
    return students.filter(student => !shownStudents.includes(student.id));
  }, [students, shownStudents]);

  const pickRandomStudent = useCallback(() => {
    if (remainingStudents.length === 0) {
      setShownStudents([]); // 当所有学生都被选过时重置
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * remainingStudents.length);
    const pickedStudent = remainingStudents[randomIndex];
    setShownStudents(prev => [...prev, pickedStudent.id]);
    return pickedStudent;
  }, [remainingStudents]);

  const resetPicker = useCallback(() => {
    setShownStudents([]);
  }, []);

  return {
    shownStudents,
    remainingStudents,
    pickRandomStudent,
    resetPicker,
  };
}