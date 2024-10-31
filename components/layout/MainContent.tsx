import React, { useState } from 'react';
import TestSection from '../TestSection';
import PerformanceChart from '../PerformanceChart';
import MistakesRecord from '../MistakesRecord';
import AIAnalysis from '../AIAnalysis';
import { Student, Question } from '@/lib/types';

interface MainContentProps {
  student: Student;
  students: Student[];
  isTestStarted: boolean;
  updateStudentTestHistory: (newTestHistory: any) => void;
  setIsTestStarted: (isStarted: boolean) => void;
  sharedQuestions?: Question[];
  setSharedQuestions?: (questions: Question[]) => void;
}

export default function MainContent({
  student,
  students,
  isTestStarted,
  updateStudentTestHistory,
  setIsTestStarted,
  sharedQuestions,
  setSharedQuestions,
}: MainContentProps) {
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});
  const [interactionHistory, setInteractionHistory] = useState<Record<string, Array<{ role: string; content: string }>>>({});

  const handleAnalysisUpdate = (key: string, result: any) => {
    setAnalysisResults(prev => ({
      ...prev,
      [key]: result
    }));
  };

  const handleInteractionUpdate = (key: string, history: Array<{ role: string; content: string }>) => {
    setInteractionHistory(prev => ({
      ...prev,
      [key]: history
    }));
  };

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-[2] overflow-auto">
        <TestSection 
          student={student} 
          updateStudentTestHistory={updateStudentTestHistory}
          setIsTestStarted={setIsTestStarted}
          sharedQuestions={sharedQuestions}
          setSharedQuestions={setSharedQuestions}
        />
        {!isTestStarted && (
          <>
            <PerformanceChart student={student} allStudents={students} />
            <MistakesRecord 
              student={student}
              students={students}
              analysisResults={analysisResults}
              interactionHistory={interactionHistory}
            />
          </>
        )}
      </div>
      {!isTestStarted && (
        <div className="flex-1 overflow-auto">
          <AIAnalysis 
            student={student} 
            onAnalysisUpdate={handleAnalysisUpdate}
            onInteractionUpdate={handleInteractionUpdate}
          />
        </div>
      )}
    </div>
  );
}