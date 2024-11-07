'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Trophy as Score, Printer, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Student } from '@/lib/types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  students: Student[];
  selectedTests: number[];
  onTestSelection: (testId: number) => void;
  onSelectAll: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  isDownloading: boolean;
  isGenerating?: boolean;
}

export default function ExportDialog({
  isOpen,
  onClose,
  student,
  students,
  selectedTests,
  onTestSelection,
  onSelectAll,
  onPrint,
  onDownloadPDF,
  onDownloadCSV,
  isDownloading,
  isGenerating = false
}: ExportDialogProps) {
  const [exportAllStudents, setExportAllStudents] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择导出内容</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="export-all-students"
              checked={exportAllStudents}
              onCheckedChange={(checked) => setExportAllStudents(checked as boolean)}
            />
            <label htmlFor="export-all-students" className="text-sm">
              导出所有学生的训练记录
            </label>
          </div>

          {!exportAllStudents && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSelectAll}
                className="w-full"
              >
                {selectedTests.length === student.testHistory.length ? '取消全选' : '全选'}
              </Button>
              <ScrollArea className="h-[300px] pr-4">
                {student.testHistory.map((test) => (
                  <div key={test.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`test-${test.id}`}
                      checked={selectedTests.includes(test.id)}
                      onCheckedChange={() => onTestSelection(test.id)}
                    />
                    <label 
                      htmlFor={`test-${test.id}`}
                      className="flex flex-1 items-center text-sm cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {test.date}
                      <Score className="w-4 h-4 mx-2" />
                      {test.score}分
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onDownloadCSV(exportAllStudents)}
            disabled={isDownloading || (!exportAllStudents && selectedTests.length === 0)}
          >
            {isDownloading ? '导出中...' : '导出 CSV'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}