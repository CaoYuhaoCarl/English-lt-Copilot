import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, Clock, Trophy as Score } from 'lucide-react';
import { TestHistory } from '@/lib/types';
import MistakeCard from './MistakeCard';

interface TestHistoryCardProps {
  test: TestHistory;
  isExpanded: boolean;
  onToggle: () => void;
  analysisResults: Record<string, any>;
  interactionHistory: Record<string, Array<{ role: string; content: string }>>;
}

export default function TestHistoryCard({ 
  test, 
  isExpanded, 
  onToggle,
  analysisResults,
  interactionHistory
}: TestHistoryCardProps) {
  // Only show actual mistakes (where isCorrect is false)
  const mistakes = React.useMemo(() => {
    return test.details.filter(detail => !detail.isCorrect);
  }, [test.details]);

  // If there are no mistakes, don't render anything
  if (mistakes.length === 0) {
    return null;
  }

  return (
    <Card className="border shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            {test.date}
          </Badge>
          <Badge variant="secondary">
            <Clock className="w-4 h-4 mr-2" />
            {mistakes.length} 道错题
          </Badge>
          <Badge>
            <Score className="w-4 h-4 mr-2" />
            {test.score}分
          </Badge>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${
          isExpanded ? 'rotate-90' : ''
        }`} />
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0">
          {mistakes.map((detail, index) => (
            <MistakeCard
              key={`${test.id}-${detail.questionId}`}
              detail={detail}
              index={index}
              analysisResult={analysisResults[`${test.id}-${detail.questionId}`]}
              interactions={interactionHistory[`${test.id}-${detail.questionId}`]}
            />
          ))}
        </div>
      )}
    </Card>
  );
}