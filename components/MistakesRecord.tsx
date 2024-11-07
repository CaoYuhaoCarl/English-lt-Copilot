"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import QuickMistakeEntry from './mistakes/quick-entry/QuickMistakeEntry';
import { Student, TestHistory } from '@/lib/types';
import { useBatchExport } from '@/hooks/useBatchExport';
import TestHistoryCard from './mistakes/TestHistoryCard';
import BatchExportDialog from './mistakes/BatchExportDialog';

interface MistakesRecordProps {
  student: Student;
  students: Student[];
  analysisResults: Record<string, any>;
  interactionHistory: Record<string, Array<{ role: string; content: string }>>;
  updateStudentTestHistory: (newTestHistory: TestHistory) => void;
}

export default function MistakesRecord({ 
  student,
  students,
  analysisResults,
  interactionHistory,
  updateStudentTestHistory
}: MistakesRecordProps) {
  const [expandedTests, setExpandedTests] = useState<number[]>([]);
  const [isBatchExportOpen, setIsBatchExportOpen] = useState(false);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const {
    isDownloading,
    isGenerating,
    handlePrint,
    handleDownloadPDF,
    handleDownloadCSV
  } = useBatchExport(students, selectedStudentIds, analysisResults, interactionHistory);

  // 按日期降序排序测试历史
  const sortedTestHistory = [...student.testHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>错题记录</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQuickEntryOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              快速录入
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStudentIds([student.id]);
                setIsBatchExportOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出记录
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedTestHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无错题记录
            </div>
          ) : (
            sortedTestHistory.map((test) => (
              <TestHistoryCard
                key={test.id}
                test={test}
                isExpanded={expandedTests.includes(test.id)}
                onToggle={() => {
                  setExpandedTests(prev =>
                    prev.includes(test.id)
                      ? prev.filter(id => id !== test.id)
                      : [...prev, test.id]
                  );
                }}
                analysisResults={analysisResults}
                interactionHistory={interactionHistory}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={isQuickEntryOpen} onOpenChange={setIsQuickEntryOpen}>
        <DialogContent className="max-w-4xl">
          <QuickMistakeEntry
            student={student}
            students={students}
            updateStudentTestHistory={(newHistory) => {
              updateStudentTestHistory(newHistory);
              setIsQuickEntryOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <BatchExportDialog
        isOpen={isBatchExportOpen}
        onClose={() => setIsBatchExportOpen(false)}
        students={students}
        selectedStudentIds={selectedStudentIds}
        onSelectedStudentsChange={setSelectedStudentIds}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        onDownloadCSV={handleDownloadCSV}
        isDownloading={isDownloading}
        isGenerating={isGenerating}
      />
    </>
  );
}