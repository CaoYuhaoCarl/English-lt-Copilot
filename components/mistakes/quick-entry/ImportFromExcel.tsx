import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question } from '@/lib/types';
import questionsData from '@/data/questions.json';

interface ImportFromExcelProps {
  onImport: (questionIds: number[]) => void;
}

export default function ImportFromExcel({ onImport }: ImportFromExcelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const data = await readExcelFile(file);
      const questionIds = matchQuestions(data);
      onImport(questionIds);
    } catch (error) {
      console.error('导入错误:', error);
      alert('导入失败，请检查文件格式是否正确');
    } finally {
      setIsLoading(false);
      // 清空文件输入，允许重复选择同一文件
      event.target.value = '';
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const matchQuestions = (data: any[]): number[] => {
    const matchedIds: number[] = [];
    const questions = questionsData.questions;

    data.forEach((row) => {
      const content = row['题目内容'] || row['题目'] || row['问题'];
      if (!content) return;

      // 尝试精确匹配
      const exactMatch = questions.find(q => q.question === content);
      if (exactMatch) {
        matchedIds.push(exactMatch.id);
        return;
      }

      // 尝试模糊匹配
      const fuzzyMatch = questions.find(q => 
        q.question.includes(content) || content.includes(q.question)
      );
      if (fuzzyMatch) {
        matchedIds.push(fuzzyMatch.id);
      }
    });

    return [...new Set(matchedIds)]; // 去重
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        id="excel-upload"
        onChange={handleFileUpload}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={() => document.getElementById('excel-upload')?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {isLoading ? '导入中...' : '从Excel导入'}
      </Button>
    </div>
  );
} 