import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download } from 'lucide-react';
import { Student } from '@/lib/types';
import TestHistoryCard from './mistakes/TestHistoryCard';
import BatchExportDialog from './mistakes/BatchExportDialog';
import { useBatchExport } from '@/hooks/useBatchExport';

interface MistakesRecordProps {
  student: Student;
  students: Student[];
  analysisResults: Record<string, any>;
  interactionHistory: Record<string, Array<{ role: string; content: string }>>;
}

export default function MistakesRecord({ 
  student,
  students,
  analysisResults,
  interactionHistory
}: MistakesRecordProps) {
  const [expandedTests, setExpandedTests] = useState<number[]>([]);
  const [isBatchExportOpen, setIsBatchExportOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const {
    isDownloading,
    isGenerating,
    handlePrint,
    handleDownloadPDF,
    handleDownloadCSV
  } = useBatchExport(students, selectedStudentIds, analysisResults, interactionHistory);

  const handleBatchExport = () => {
    setSelectedStudentIds([student.id]);
    setIsBatchExportOpen(true);
  };

  // Filter students to only include those with mistakes
  const studentsWithMistakes = students.filter(s => 
    s.testHistory.some(test => 
      test.details.some(detail => !detail.isCorrect)
    )
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>错题记录</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBatchExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          批量导出
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {student.testHistory.map((test) => (
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
            ))}
          </div>
        </ScrollArea>

        <BatchExportDialog
          isOpen={isBatchExportOpen}
          onClose={() => setIsBatchExportOpen(false)}
          students={studentsWithMistakes}
          selectedStudentIds={selectedStudentIds}
          onSelectedStudentsChange={setSelectedStudentIds}
          onPrint={handlePrint}
          onDownloadPDF={handleDownloadPDF}
          onDownloadCSV={handleDownloadCSV}
          isDownloading={isDownloading}
          isGenerating={isGenerating}
        />
      </CardContent>
    </Card>
  );
}