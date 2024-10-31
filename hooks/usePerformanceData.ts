import { useMemo } from 'react';
import { Student } from '@/lib/types';
import questionsData from '@/data/questions.json';

interface PerformanceData {
  date: string;
  score: number;
  classAverage: number | null;
}

interface TypeAccuracy {
  type: string;
  personalAccuracy: number;
  classAverage: number;
}

interface AbilityData {
  ability: string;
  score: number;
  average: number;
  maxScore: number;
}

interface KeyPointData {
  keyPoint: string;
  score: number;
  average: number;
  maxScore: number;
}

export function usePerformanceData(student: Student, allStudents: Student[]) {
  // 计算整体表现数据
  const chartData = useMemo(() => {
    const classStudents = allStudents.filter(s => s.class === student.class);
    
    return student.testHistory.map(test => {
      // 获取同一天参加测试的所有学生的成绩
      const sameDayTests = classStudents
        .map(s => s.testHistory.find(t => t.date === test.date))
        .filter((t): t is NonNullable<typeof t> => t !== undefined);

      // 计算班级平均分
      const classAverage = sameDayTests.length > 0
        ? sameDayTests.reduce((sum, t) => sum + t.score, 0) / sameDayTests.length
        : null;

      return {
        date: test.date,
        score: test.score,
        classAverage
      };
    });
  }, [student.testHistory, allStudents, student.class]);

  // 计算各题型准确率数据
  const typeAccuracyData = useMemo(() => {
    const classStudents = allStudents.filter(s => s.class === student.class);
    const studentData = student.testHistory.flatMap(test => test.details);

    // 收集所有班级学生的答题数据
    const classData = classStudents.flatMap(s => 
      s.testHistory.flatMap(test => test.details)
    );

    const calculateTypeAccuracy = (details: typeof studentData) => {
      return details.reduce((acc, detail) => {
        const question = questionsData.questions.find(q => q.id === detail.questionId);
        if (!question) return acc;

        if (!acc[question.type]) {
          acc[question.type] = { correct: 0, total: 0 };
        }
        acc[question.type].total++;
        if (detail.isCorrect) acc[question.type].correct++;
        return acc;
      }, {} as Record<string, { correct: number; total: number }>);
    };

    const studentAccuracy = calculateTypeAccuracy(studentData);
    const classAccuracy = calculateTypeAccuracy(classData);

    return Object.keys(studentAccuracy).map(type => ({
      type,
      personalAccuracy: (studentAccuracy[type].correct / studentAccuracy[type].total) * 100,
      classAverage: (classAccuracy[type].correct / classAccuracy[type].total) * 100
    }));
  }, [student.testHistory, allStudents, student.class]);

  // 计算能力维度数据
  const abilityData = useMemo(() => {
    const classStudents = allStudents.filter(s => s.class === student.class);
    const studentDetails = student.testHistory.flatMap(test => test.details);
    const classDetails = classStudents.flatMap(s => 
      s.testHistory.flatMap(test => test.details)
    );

    const calculateAbilityScores = (details: typeof studentDetails) => {
      return details.reduce((acc, detail) => {
        const question = questionsData.questions.find(q => q.id === detail.questionId);
        if (!question) return acc;

        if (!acc[question.ability]) {
          acc[question.ability] = { score: 0, total: 0, count: 0 };
        }
        acc[question.ability].total += question.score || 0;
        acc[question.ability].score += detail.isCorrect ? (question.score || 0) : 0;
        acc[question.ability].count++;
        return acc;
      }, {} as Record<string, { score: number; total: number; count: number }>);
    };

    const studentScores = calculateAbilityScores(studentDetails);
    const classScores = calculateAbilityScores(classDetails);

    return Object.entries(studentScores).map(([ability, data]) => ({
      ability,
      score: (data.score / data.total) * 100,
      average: (classScores[ability].score / classScores[ability].total) * 100,
      maxScore: 100
    }));
  }, [student.testHistory, allStudents, student.class]);

  // 计算知识点掌握度数据
  const keyPointData = useMemo(() => {
    const classStudents = allStudents.filter(s => s.class === student.class);
    const studentDetails = student.testHistory.flatMap(test => test.details);
    const classDetails = classStudents.flatMap(s => 
      s.testHistory.flatMap(test => test.details)
    );

    const calculateKeyPointScores = (details: typeof studentDetails) => {
      return details.reduce((acc, detail) => {
        const question = questionsData.questions.find(q => q.id === detail.questionId);
        if (!question) return acc;

        if (!acc[question.keyPoint]) {
          acc[question.keyPoint] = { score: 0, total: 0, count: 0 };
        }
        acc[question.keyPoint].total += question.score || 0;
        acc[question.keyPoint].score += detail.isCorrect ? (question.score || 0) : 0;
        acc[question.keyPoint].count++;
        return acc;
      }, {} as Record<string, { score: number; total: number; count: number }>);
    };

    const studentScores = calculateKeyPointScores(studentDetails);
    const classScores = calculateKeyPointScores(classDetails);

    return Object.entries(studentScores).map(([keyPoint, data]) => ({
      keyPoint,
      score: (data.score / data.total) * 100,
      average: (classScores[keyPoint].score / classScores[keyPoint].total) * 100,
      maxScore: 100
    }));
  }, [student.testHistory, allStudents, student.class]);

  return {
    chartData,
    typeAccuracyData,
    abilityData,
    keyPointData,
    hasData: chartData.length > 0
  };
}