import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Printer, Download, FileSpreadsheet } from 'lucide-react';
import { Student } from '@/lib/types';

interface BatchExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudentIds: string[];
  onSelectedStudentsChange: (ids: string[]) => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  isDownloading: boolean;
  isGenerating: boolean;
}

export default function BatchExportDialog({
  isOpen,
  onClose,
  students,
  selectedStudentIds,
  onSelectedStudentsChange,
  onPrint,
  onDownloadPDF,
  onDownloadCSV,
  isDownloading,
  isGenerating
}: BatchExportDialogProps) {
  const handleSelectAll = () => {
    const allStudentIds = students
      .filter(student => student.testHistory.some(test => 
        test.details.some(detail => !detail.isCorrect)
      ))
      .map(student => student.id);
    
    onSelectedStudentsChange(
      selectedStudentIds.length === allStudentIds.length ? [] : allStudentIds
    );
  };

  const handleStudentSelection = (studentId: string) => {
    onSelectedStudentsChange(
      selectedStudentIds.includes(studentId)
        ? selectedStudentIds.filter(id => id !== studentId)
        : [...selectedStudentIds, studentId]
    );
  };

  const studentsWithMistakes = students.filter(student =>
    student.testHistory.some(test =>
      test.details.some(detail => !detail.isCorrect)
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>批量导出错题记录</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
            className="w-full mb-4"
          >
            {selectedStudentIds.length === studentsWithMistakes.length ? '取消全选' : '全选'}
          </Button>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {studentsWithMistakes.map((student) => {
                const mistakeCount = student.testHistory.reduce((count, test) =>
                  count + test.details.filter(detail => !detail.isCorrect).length, 0
                );

                if (mistakeCount === 0) return null;

                return (
                  <div
                    key={student.id}
                    className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-accent"
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedStudentIds.includes(student.id)}
                      onCheckedChange={() => handleStudentSelection(student.id)}
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="flex flex-1 items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{student.name}</span>
                        <Badge variant="outline">
                          {student.grade}{student.class}班
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {mistakeCount} 道错题
                        </Badge>
                        <Badge>
                          {student.testHistory.length} 次测试
                        </Badge>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button 
              variant="outline" 
              onClick={onPrint}
              disabled={isGenerating || selectedStudentIds.length === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              {isGenerating ? '生成中...' : '打印完整报告'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onDownloadCSV}
              disabled={selectedStudentIds.length === 0}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              导出CSV
            </Button>
            <Button 
              onClick={onDownloadPDF}
              disabled={isDownloading || selectedStudentIds.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? '导出中...' : '导出PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}