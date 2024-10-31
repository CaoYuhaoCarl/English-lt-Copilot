import React from 'react';
import { Badge } from "@/components/ui/badge";
import { XCircle } from 'lucide-react';
import { Question } from '@/lib/types';
import questionsData from '@/data/questions.json';

// Helper function to format answer display
function formatAnswer(answer: string | string[]): string {
  if (Array.isArray(answer)) {
    return answer.join(' 或 ');
  }
  return answer.split('|').map(a => a.trim()).join(' 或 ');
}

interface MistakeCardProps {
  detail: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
  };
  index: number;
  analysisResult?: {
    errorAnalysis?: string;
    guidance?: string;
    similarQuestions?: string;
    keyPointSummary?: string;
    abilityImprovement?: string;
  };
  interactions?: Array<{ role: string; content: string }>;
}

export default function MistakeCard({ 
  detail, 
  index,
  analysisResult,
  interactions
}: MistakeCardProps) {
  const question = React.useMemo(() => {
    return questionsData.questions.find(q => q.id === detail.questionId);
  }, [detail.questionId]);

  if (!question) {
    return null;
  }

  const formattedAnswer = formatAnswer(question.answer);

  return (
    <div className="p-4 rounded-lg bg-accent/50 mb-2 last:mb-0">
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline">{question.type}题</Badge>
        <div className="flex gap-2">
          <Badge variant="secondary">{question.keyPoint}</Badge>
          <Badge variant="secondary">{question.ability}</Badge>
        </div>
      </div>
      
      <p className="text-lg font-medium mb-4">{question.question}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-red-500 dark:text-red-400">
          <XCircle className="w-4 h-4 mr-2" />
          <span>你的答案：{detail.userAnswer}</span>
        </div>
        <div className="flex items-center text-green-500 dark:text-green-400">
          <span>正确答案：{formattedAnswer}</span>
        </div>
      </div>

      {analysisResult && (
        <div className="mt-4 space-y-4">
          {analysisResult.errorAnalysis && (
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">错误分析</h4>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.errorAnalysis}</p>
            </div>
          )}
          
          {analysisResult.guidance && (
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">启发引导</h4>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.guidance}</p>
            </div>
          )}

          {analysisResult.keyPointSummary && (
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">知识点总结</h4>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.keyPointSummary}</p>
            </div>
          )}

          {analysisResult.abilityImprovement && (
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">能力提升建议</h4>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.abilityImprovement}</p>
            </div>
          )}
        </div>
      )}

      {interactions && interactions.length > 0 && (
        <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="font-medium mb-2">互动记录</h4>
          <div className="space-y-2">
            {interactions.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-4'
                    : 'bg-secondary/10 mr-4'
                }`}
              >
                <span className="font-medium">{msg.role === 'user' ? '学生' : 'AI'}：</span>
                <span className="text-sm">{msg.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}