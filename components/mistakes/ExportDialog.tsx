'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Trophy as Score, Printer, Download, FileSpreadsheet } from 'lucide-react';
import { Student } from '@/lib/types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
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
  selectedTests,
  onTestSelection,
  onSelectAll,
  onPrint,
  onDownloadPDF,
  onDownloadCSV,
  isDownloading,
  isGenerating = false
}: ExportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择要导出的测评记录</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSelectAll}
            className="w-full mb-4"
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
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button 
              variant="outline" 
              onClick={onPrint}
              disabled={isGenerating || selectedTests.length === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              {isGenerating ? '生成中...' : '打印完整报告'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onDownloadCSV}
              disabled={selectedTests.length === 0}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              导出CSV
            </Button>
            <Button 
              onClick={onDownloadPDF}
              disabled={isDownloading || selectedTests.length === 0}
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