import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileSpreadsheet, Download } from 'lucide-react';
import { Student } from '@/lib/types';
import TestHistoryCard from './TestHistoryCard';
import ExportDialog from './ExportDialog';
import { useExportMistakes } from '@/hooks/useExportMistakes';

interface MistakesRecordProps {
  student: Student;
}

export default function MistakesRecord({ student }: MistakesRecordProps) {
  const mistakesRef = useRef<HTMLDivElement>(null);
  const [expandedTests, setExpandedTests] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);

  const {
    error,
    isDownloading,
    handlePrint,
    handleDownloadPDF,
    handleDownloadCSV
  } = useExportMistakes(student, selectedTests, mistakesRef);

  const toggleTestExpansion = (testId: number) => {
    setExpandedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleTestSelection = (testId: number) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSelectAll = () => {
    const allTestIds = student.testHistory.map(test => test.id);
    setSelectedTests(prev => 
      prev.length === allTestIds.length ? [] : allTestIds
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>错题记录</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDownloadCSV()}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            导出CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            导出记录
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4" ref={mistakesRef}>
            {student.testHistory.map((test) => (
              <TestHistoryCard
                key={test.id}
                test={test}
                isExpanded={expandedTests.includes(test.id)}
                onToggle={() => toggleTestExpansion(test.id)}
              />
            ))}
          </div>
        </ScrollArea>

        <ExportDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          student={student}
          selectedTests={selectedTests}
          onTestSelection={handleTestSelection}
          onSelectAll={handleSelectAll}
          onPrint={handlePrint}
          onDownloadPDF={handleDownloadPDF}
          onDownloadCSV={handleDownloadCSV}
          isDownloading={isDownloading}
        />
      </CardContent>
    </Card>
  );
}