import { useState } from 'react';
import { Student } from '@/lib/types';
import questionsData from '@/data/questions.json';

export function usePrintReport(
  student: Student,
  selectedTests: number[],
  analysisResults: Record<string, any>,
  interactionHistory: Record<string, Array<{ role: string; content: string }>>
) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrintContent = () => {
    const selectedTestsData = student.testHistory
      .filter(test => selectedTests.includes(test.id))
      .map(test => {
        const mistakes = test.details
          .filter(detail => !detail.isCorrect)
          .map(detail => {
            const question = questionsData.questions.find(q => q.id === detail.questionId);
            if (!question) return null;

            const key = `${test.id}-${detail.questionId}`;
            const analysis = analysisResults[key];
            const interactions = interactionHistory[key];

            return {
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

        return {
          date: test.date,
          score: test.score,
          mistakes
        };
      });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${student.name}的学习报告</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: system-ui, -apple-system, "Microsoft YaHei", sans-serif;
              padding: 40px;
              max-width: 210mm;
              margin: 0 auto;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
            .header h1 {
              margin: 0 0 10px 0;
              color: #1a1a1a;
            }
            .header p {
              margin: 0;
              color: #666;
            }
            .test-section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .test-header {
              background: #f5f5f5;
              padding: 15px 20px;
              margin-bottom: 20px;
              border-radius: 8px;
              color: #1a1a1a;
            }
            .test-header h3 {
              margin: 0;
              font-size: 18px;
            }
            .mistake {
              padding: 20px;
              margin-bottom: 20px;
              border: 1px solid #eee;
              border-radius: 8px;
              background: #fff;
            }
            .mistake:last-child {
              margin-bottom: 0;
            }
            .question {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 15px 0;
              color: #1a1a1a;
            }
            .wrong {
              color: #dc2626;
              margin: 10px 0;
            }
            .correct {
              color: #16a34a;
              margin: 10px 0;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin: 15px 0;
              padding-top: 15px;
              border-top: 1px solid #eee;
            }
            .analysis {
              margin: 20px 0;
              padding: 20px;
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
              padding: 20px;
              background: #f0f4f8;
              border-radius: 8px;
            }
            .interactions h4 {
              margin: 0 0 15px 0;
              color: #1a1a1a;
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
              body {
                padding: 20px;
              }
              .test-section {
                page-break-inside: avoid;
              }
              .mistake {
                break-inside: avoid;
              }
              .analysis {
                break-inside: avoid;
              }
              .interactions {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${student.name}的学习报告</h1>
            <p>班级：${student.grade}${student.class}班</p>
          </div>
          ${selectedTestsData.map(test => `
            <div class="test-section">
              <div class="test-header">
                <h3>测试日期：${test.date} | 得分：${test.score}分</h3>
              </div>
              ${test.mistakes.map(mistake => `
                <div class="mistake">
                  <p class="question">${mistake.type}题：${mistake.question}</p>
                  <p class="wrong">你的答案：${mistake.userAnswer}</p>
                  <p class="correct">正确答案：${mistake.correctAnswer}</p>
                  <p class="meta">知识点：${mistake.keyPoint} | 能力：${mistake.ability}</p>
                  
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
  };

  const handlePrint = () => {
    if (selectedTests.length === 0) {
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
      console.error('Error generating print content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handlePrint
  };
}