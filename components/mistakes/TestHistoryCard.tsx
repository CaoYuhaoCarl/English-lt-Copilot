import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
  const mistakes = test.details.filter(detail => !detail.isCorrect);
  
  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent"
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
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {mistakes.map((detail) => {
            const key = `${test.id}-${detail.questionId}`;
            const analysisResult = analysisResults[key];
            const interactions = interactionHistory[key];
            
            return (
              <MistakeCard
                key={detail.questionId}
                detail={detail}
                analysisResult={analysisResult}
                interactions={interactions}
              />
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}