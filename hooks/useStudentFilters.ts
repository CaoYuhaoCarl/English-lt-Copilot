import { useState, useCallback, useMemo } from 'react';
import { Student, StudentFilters } from '@/lib/types';

export function useStudentFilters(students: Student[]) {
  const [filters, setFilters] = useState<StudentFilters>({
    grade: 'all',
    class: 'all',
    searchQuery: '',
  });

  const grades = useMemo(() => {
    const uniqueGrades = Array.from(new Set(students.map(s => s.grade)))
      .filter(grade => grade.trim() !== '');
    return ['all', ...uniqueGrades];
  }, [students]);

  const classes = useMemo(() => {
    const uniqueClasses = Array.from(new Set(students.map(s => s.class)))
      .filter(classNum => classNum.trim() !== '');
    return ['all', ...uniqueClasses];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesGrade = filters.grade === 'all' || student.grade === filters.grade;
      const matchesClass = filters.class === 'all' || student.class === filters.class;
      const matchesSearch = student.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      return matchesGrade && matchesClass && matchesSearch;
    });
  }, [students, filters]);

  const updateFilter = useCallback((key: keyof StudentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    filters,
    updateFilter,
    filteredStudents,
    grades,
    classes,
  };
}