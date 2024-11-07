import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question } from '@/lib/types';
import questionsData from '@/data/questions.json';

interface ImportFromFileProps {
  onImport: (questionIds: number[]) => void;
}

export default function ImportFromFile({ onImport }: ImportFromFileProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let data: any[] = [];
      
      if (file.name.endsWith('.csv')) {
        // 处理 CSV 文件
        data = await readCSVFile(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // 处理 Excel 文件
        data = await readExcelFile(file);
      }

      const questionIds = matchQuestions(data);
      onImport(questionIds);
    } catch (error) {
      console.error('导入错误:', error);
      alert('导入失败，请检查文件格式是否正确');
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // 读取 CSV 文件
  const readCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',').map(h => h.trim());
          
          const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index]?.trim() || '';
              return obj;
            }, {} as any);
          });
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  // 读取 Excel 文件
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

  // 匹配题目
  const matchQuestions = (data: any[]): number[] => {
    const matchedIds: number[] = [];
    const questions = questionsData.questions;

    data.forEach((row) => {
      // 尝试从不同的可能的列名中获取题目内容
      const content = row['题目内容'] || row['题目'] || row['问题'] || row['question'] || '';
      if (!content) return;

      // 尝试精确匹配
      const exactMatch = questions.find(q => q.question === content.trim());
      if (exactMatch) {
        matchedIds.push(exactMatch.id);
        return;
      }

      // 尝试模糊匹配
      const fuzzyMatch = questions.find(q => 
        q.question.includes(content.trim()) || content.trim().includes(q.question)
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
        accept=".csv,.xlsx,.xls"
        className="hidden"
        id="file-upload"
        onChange={handleFileUpload}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={() => document.getElementById('file-upload')?.click()}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <FileSpreadsheet className="w-4 h-4 animate-spin" />
            导入中...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            导入错题
          </>
        )}
      </Button>
    </div>
  );
} 