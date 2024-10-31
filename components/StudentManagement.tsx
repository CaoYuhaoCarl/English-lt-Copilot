'use client';

import React from 'react';
import { useStudentManagement } from '@/hooks/useStudentManagement';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import MainContent from './layout/MainContent';

export default function StudentManagement() {
  const {
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
  } = useStudentManagement();

  return (
    <div className="flex h-screen w-full">
      <Sidebar 
        isOpen={isSidebarOpen}
        students={students}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        setStudents={setStudents}
      />
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        <Header 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 overflow-auto p-4">
          <MainContent 
            student={selectedStudent}
            students={students}
            isTestStarted={isTestStarted}
            updateStudentTestHistory={updateStudentTestHistory}
            setIsTestStarted={setIsTestStarted}
            sharedQuestions={sharedQuestions}
            setSharedQuestions={setSharedQuestions}
          />
        </div>
      </div>
    </div>
  );
}