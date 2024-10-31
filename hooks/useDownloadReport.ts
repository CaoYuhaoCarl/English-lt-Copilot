import { useState } from 'react';
import { Student } from '@/lib/types';
import questionsData from '@/data/questions.json';

export function useDownloadReport(
  student: Student,
  analysisResults: Record<string, any>,
  interactionHistory: Record<string, Array<{ role: string; content: string }>>
) {
  const [isDownloading, setIsDownloading] = useState(false);

  const generateReportContent = () => {
    let content = `${student.name}的学习报告\n\n`;

    student.testHistory.forEach((test) => {
      test.details.filter(detail => !detail.isCorrect).forEach((detail) => {
        const question = questionsData.questions.find(q => q.id === detail.questionId);
        if (!question) return;

        const key = `${test.id}-${detail.questionId}`;
        const result = analysisResults[key];
        if (!result) return;

        // 题目基本信息
        content += `题目：${question.question}\n`;
        content += `正确答案：${question.answer}\n`;
        content += `学生答案：${detail.userAnswer}\n`;
        content += `知识点：${question.keyPoint}\n`;
        content += `能力：${question.ability}\n\n`;

        // AI 分析内容
        content += `错误分析：\n${result.errorAnalysis}\n\n`;
        content += `启发引导：\n${result.guidance}\n\n`;
        content += `练习题：\n${result.similarQuestions}\n\n`;
        content += `知识点分析：\n${result.keyPointSummary}\n\n`;
        content += `能力提升建议：\n${result.abilityImprovement}\n\n`;

        // 互动记录
        const interactions = interactionHistory[key];
        if (interactions && interactions.length > 0) {
          content += `互动记录：\n`;
          content += `${'='.repeat(50)}\n`;
          interactions.forEach((msg, index) => {
            const role = msg.role === 'user' ? '学生' : 'AI';
            content += `${role}：${msg.content}\n`;
            if (index < interactions.length - 1) {
              content += '-'.repeat(30) + '\n';
            }
          });
          content += `${'='.repeat(50)}\n\n`;
        }

        content += `${'-'.repeat(80)}\n\n`;
      });
    });

    return content;
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const content = generateReportContent();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${student.name}_AI分析报告.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload
  };
}