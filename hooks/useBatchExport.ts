import { useState, useCallback } from 'react';
import { Student } from '@/lib/types';
import questionsData from '@/data/questions.json';
import { useToast } from "@/components/ui/use-toast";

export function useBatchExport(
  students: Student[],
  selectedStudentIds: string[],
  analysisResults: Record<string, any>,
  interactionHistory: Record<string, Array<{ role: string; content: string }>>
) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCSV = useCallback(() => {
    try {
      const selectedStudents = students.filter(student => 
        selectedStudentIds.includes(student.id)
      );

      const headers = [
        '年级',
        '班级',
        '学生姓名',
        '测试日期',
        '总分',
        '题目类型',
        '题目',
        '正确答案',
        '学生答案',
        '是否正确',
        '得分',
        '用时(秒)',
        '知识点',
        '能力',
        'AI分析',
        '互动记录'
      ];

      const rows = selectedStudents.flatMap(student =>
        student.testHistory.flatMap(test =>
          test.details.map(detail => {
            const question = questionsData.questions.find(q => q.id === detail.questionId);
            if (!question) return null;

            const key = `${test.id}-${detail.questionId}`;
            const analysis = analysisResults[key];
            const interactions = interactionHistory[key];

            return [
              student.grade,
              student.class,
              student.name,
              test.date,
              test.score,
              question.type,
              question.question,
              question.answer,
              detail.userAnswer,
              detail.isCorrect ? '正确' : '错误',
              detail.score,
              (detail.time / 1000).toFixed(1),
              question.keyPoint,
              question.ability,
              analysis ? JSON.stringify(analysis) : '',
              interactions ? JSON.stringify(interactions) : ''
            ];
          }).filter(Boolean)
        )
      );

      const BOM = '\uFEFF';
      const csv = BOM + [
        headers.join(','),
        ...rows.map(row =>
          row.map(cell =>
            typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          ).join(',')
        )
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw new Error('生成CSV数据时出错');
    }
  }, [students, selectedStudentIds, analysisResults, interactionHistory]);

  const generatePrintContent = useCallback(() => {
    try {
      const selectedStudents = students.filter(student => 
        selectedStudentIds.includes(student.id)
      );

      const content = selectedStudents.map(student => {
        const studentMistakes = student.testHistory.flatMap(test => {
          const mistakes = test.details
            .filter(detail => !detail.isCorrect)
            .map(detail => {
              const question = questionsData.questions.find(q => q.id === detail.questionId);
              if (!question) return null;

              const key = `${test.id}-${detail.questionId}`;
              const analysis = analysisResults[key];
              const interactions = interactionHistory[key];

              return {
                date: test.date,
                score: test.score,
                type: question.type,
                question: question.question,
                userAnswer: detail.userAnswer,
                correctAnswer: question.answer,
                keyPoint: question.keyPoint,
                ability: question.ability,
                analysis,
                interactions
              };
            })
            .filter(Boolean);

          return mistakes;
        });

        return {
          student,
          mistakes: studentMistakes
        };
      });

      return `
        <!DOCTYPE html>
        <html>
          <head>
            <title>学生错题记录汇总</title>
            <meta charset="utf-8">
            <style>
              body {
                font-family: system-ui, -apple-system, "Microsoft YaHei", sans-serif;
                padding: 40px;
                max-width: 210mm;
                margin: 0 auto;
                color: #333;
              }
              .student-section {
                margin-bottom: 60px;
                page-break-before: always;
              }
              .student-section:first-child {
                page-break-before: avoid;
              }
              .student-header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
              }
              .student-header h1 {
                margin: 0 0 10px 0;
                color: #1a1a1a;
              }
              .student-header p {
                margin: 0;
                color: #666;
              }
              .mistake {
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid #eee;
                border-radius: 8px;
                background: #fff;
                page-break-inside: avoid;
              }
              .mistake-header {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
              }
              .mistake-content {
                margin-bottom: 15px;
              }
              .answer {
                margin: 10px 0;
                padding: 5px 10px;
                border-radius: 4px;
              }
              .wrong-answer {
                background: #fee2e2;
                color: #dc2626;
              }
              .correct-answer {
                background: #dcfce7;
                color: #16a34a;
              }
              .meta {
                color: #666;
                font-size: 14px;
                margin: 15px 0;
              }
              .analysis {
                margin: 20px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
              }
              .analysis h4 {
                margin: 0 0 10px 0;
                color: #1a1a1a;
              }
              .analysis-content {
                white-space: pre-wrap;
                font-size: 14px;
                line-height: 1.6;
              }
              .interactions {
                margin: 20px 0;
                padding: 15px;
                background: #f0f4f8;
                border-radius: 8px;
              }
              .message {
                margin: 10px 0;
                padding: 10px;
                border-radius: 4px;
              }
              .user-message {
                background: #e3f2fd;
                margin-left: 20px;
              }
              .ai-message {
                background: #f5f5f5;
                margin-right: 20px;
              }
              @media print {
                .student-section {
                  page-break-before: always;
                }
                .mistake {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${content.map(({ student, mistakes }) => `
              <div class="student-section">
                <div class="student-header">
                  <h1>${student.name}的错题记录</h1>
                  <p>班级：${student.grade}${student.class}班</p>
                  <p>错题数量：${mistakes.length}</p>
                </div>
                ${mistakes.map(mistake => `
                  <div class="mistake">
                    <div class="mistake-header">
                      <div>日期：${mistake.date} | 得分：${mistake.score}分</div>
                    </div>
                    <div class="mistake-content">
                      <div><strong>${mistake.type}题：</strong>${mistake.question}</div>
                      <div class="answer wrong-answer">你的答案：${mistake.userAnswer}</div>
                      <div class="answer correct-answer">正确答案：${mistake.correctAnswer}</div>
                      <div class="meta">
                        知识点：${mistake.keyPoint} | 能力：${mistake.ability}
                      </div>
                    </div>
                    ${mistake.analysis ? `
                      <div class="analysis">
                        <h4>AI 分析</h4>
                        ${mistake.analysis.errorAnalysis ? `
                          <div class="analysis-content">
                            <strong>错误分析：</strong>
                            ${mistake.analysis.errorAnalysis}
                          </div>
                        ` : ''}
                        ${mistake.analysis.guidance ? `
                          <div class="analysis-content">
                            <strong>启发引导：</strong>
                            ${mistake.analysis.guidance}
                          </div>
                        ` : ''}
                        ${mistake.analysis.keyPointSummary ? `
                          <div class="analysis-content">
                            <strong>知识点总结：</strong>
                            ${mistake.analysis.keyPointSummary}
                          </div>
                        ` : ''}
                        ${mistake.analysis.abilityImprovement ? `
                          <div class="analysis-content">
                            <strong>能力提升建议：</strong>
                            ${mistake.analysis.abilityImprovement}
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}
                    ${mistake.interactions && mistake.interactions.length > 0 ? `
                      <div class="interactions">
                        <h4>互动记录</h4>
                        ${mistake.interactions.map(msg => `
                          <div class="message ${msg.role === 'user' ? 'user-message' : 'ai-message'}">
                            <strong>${msg.role === 'user' ? '学生' : 'AI'}：</strong>
                            ${msg.content}
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </body>
        </html>
      `;
    } catch (error) {
      console.error('Error generating print content:', error);
      throw new Error('生成打印内容时出错');
    }
  }, [students, selectedStudentIds, analysisResults, interactionHistory]);

  const handlePrint = useCallback(async () => {
    if (selectedStudentIds.length === 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请至少选择一个学生"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('无法打开打印窗口，请检查浏览器设置');
      }

      const printContent = generatePrintContent();
      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    } catch (error) {
      console.error('Error printing content:', error);
      toast({
        variant: "destructive",
        title: "打印失败",
        description: error instanceof Error ? error.message : "打印时出现未知错误"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStudentIds.length, generatePrintContent, toast]);

  const handleDownloadPDF = useCallback(async () => {
    if (selectedStudentIds.length === 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请至少选择一个学生"
      });
      return;
    }

    setIsDownloading(true);

    try {
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const html2canvas = html2canvasModule.default;
      const jsPDF = jsPDFModule.default;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatePrintContent();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const imgWidth = pageWidth - 40;
      const imgHeight = (imgWidth / contentWidth) * contentHeight;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      let heightLeft = imgHeight;
      let position = 20;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);

      pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
      const fileName = selectedStudents.length === 1
        ? `${selectedStudents[0].name}_错题记录_${new Date().toISOString().split('T')[0]}.pdf`
        : `错题记录汇总_${new Date().toISOString().split('T')[0]}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        variant: "destructive",
        title: "导出失败",
        description: error instanceof Error ? error.message : "导出PDF时出现未知错误"
      });
    } finally {
      setIsDownloading(false);
    }
  }, [students, selectedStudentIds, generatePrintContent, toast]);

  const handleDownloadCSV = useCallback(() => {
    if (selectedStudentIds.length === 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请至少选择一个学生"
      });
      return;
    }

    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
      const fileName = selectedStudents.length === 1
        ? `${selectedStudents[0].name}_训练记录_${new Date().toISOString().split('T')[0]}.csv`
        : `训练记录汇总_${new Date().toISOString().split('T')[0]}.csv`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        variant: "destructive",
        title: "导出失败",
        description: error instanceof Error ? error.message : "导出CSV时出现未知错误"
      });
    }
  }, [students, selectedStudentIds, generateCSV, toast]);

  return {
    isDownloading,
    isGenerating,
    handlePrint,
    handleDownloadPDF,
    handleDownloadCSV
  };
}