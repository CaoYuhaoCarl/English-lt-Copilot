import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Student, Question, TestHistory, QuestionType } from '@/lib/types';
import questionsData from '@/data/questions.json';
import PerfectScoreCelebration from './PerfectScoreCelebration';
import TestConfigPanel from './test/TestConfigPanel';
import CardMode from './test/CardMode';
import InputMode from './test/InputMode';
import TestHeader from './test/TestHeader';
import TestLayout from './test/TestLayout';

interface TestSectionProps {
  student: Student;
  updateStudentTestHistory: (newTestHistory: TestHistory) => void;
  setIsTestStarted: (isStarted: boolean) => void;
  sharedQuestions?: Question[];
  setSharedQuestions?: (questions: Question[]) => void;
}

// 辅助函数：标准化字符串用于比较
function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

// 辅助函数：获取所有可能的答案
function getPossibleAnswers(answer: string | string[]): string[] {
  if (Array.isArray(answer)) {
    return answer;
  }
  // 用 '或' 或 '|' 分割答案，并处理可能的空格
  return answer.split(/[或|]/).map(a => a.trim());
}

// 辅助函数：验证答案
function isCorrectAnswer(userAnswer: string, correctAnswer: string | string[]): boolean {
  const normalizedUserAnswer = normalizeString(userAnswer);
  const possibleAnswers = getPossibleAnswers(correctAnswer);
  
  return possibleAnswers.some(answer => 
    normalizeString(answer) === normalizedUserAnswer
  );
}

export default function TestSection({
  student,
  updateStudentTestHistory,
  setIsTestStarted,
  sharedQuestions,
  setSharedQuestions,
}: TestSectionProps) {
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    { type: "单词", count: 4, score: 25, timeLimit: 10, minTime: 5 },
    { type: "短语", count: 0, score: 25, timeLimit: 10, minTime: 5 },
    { type: "句子", count: 0, score: 25, timeLimit: 15, minTime: 8 },
    { type: "语法", count: 0, score: 25, timeLimit: 15, minTime: 8 }
  ]);
  const [testMode, setTestMode] = useState<'input' | 'card'>('card');
  const [questionMode, setQuestionMode] = useState<'unified' | 'random'>('random');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, { value: string | boolean; time: number; score: number; }>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [showPerfectScore, setShowPerfectScore] = useState(false);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [selectedTextbook, setSelectedTextbook] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const resetTest = useCallback(() => {
    setIsTestActive(false);
    setCurrentQuestions([]);
    setAnswers({});
    setTimeLeft(0);
    setFlippedCards({});
    setCurrentQuestionIndex(0);
    setQuestionStartTime(0);
    setCurrentScore(0);
    setShowEmoji(false);
    setShowPerfectScore(false);
    setIsTestStarted(false);
    setHasSubmitted(false);
  }, [setIsTestStarted]);

  const calculateScore = useCallback((elapsedTime: number, initialScore: number, isCorrect: boolean, timeLimit: number, minTime: number): number => {
    if (!isCorrect) return 0;
    
    const secondsPassed = Math.floor(elapsedTime / 1000);
    
    if (secondsPassed > timeLimit) return 0;
    if (secondsPassed <= minTime) return initialScore;
    
    const ratio = (secondsPassed - minTime) / (timeLimit - minTime);
    const scorePercentage = Math.pow(1 - ratio, 2);
    
    return Math.round(initialScore * scorePercentage * 100) / 100;
  }, []);

  const handleAnswerChange = useCallback((id: number, value: string | boolean) => {
    if (testMode === 'input') {
      setAnswers(prev => ({ ...prev, [id]: { value, time: 0, score: 0 } }));
    } else {
      const currentTime = Date.now();
      const elapsedTime = currentTime - questionStartTime;
      const currentQuestion = currentQuestions[currentQuestionIndex];
      if (!currentQuestion) return;

      const score = calculateScore(
        elapsedTime,
        currentQuestion.score || 0,
        value === true,
        currentQuestion.timeLimit || 30,
        currentQuestion.minTime || 3
      );

      const newAnswers = { ...answers, [id]: { value, time: elapsedTime, score } };
      setAnswers(newAnswers);
      
      const newTotalScore = Object.values(newAnswers).reduce((sum, ans) => sum + (ans.score || 0), 0);
      setCurrentScore(newTotalScore);
      
      setFlippedCards(prev => ({ ...prev, [id]: true }));
      setShowEmoji(true);
      
      setTimeout(() => {
        setShowEmoji(false);
        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setQuestionStartTime(Date.now());
        }
      }, 1000);
    }
  }, [testMode, questionStartTime, currentQuestions, currentQuestionIndex, answers, calculateScore]);

  const handleTypeChange = useCallback((type: string, checked: boolean) => {
    setSelectedTypes(prev => prev.map(t => 
      t.type === type ? { ...t, count: checked ? 1 : 0 } : t
    ));
  }, []);

  const handleCountChange = useCallback((type: string, count: number) => {
    setSelectedTypes(prev => prev.map(t => 
      t.type === type ? { ...t, count: Math.max(0, count) } : t
    ));
  }, []);

  const handleScoreChange = useCallback((type: string, score: number) => {
    setSelectedTypes(prev => prev.map(t => 
      t.type === type ? { ...t, score: Math.max(1, score) } : t
    ));
  }, []);

  const handleTimeLimitChange = useCallback((type: string, timeLimit: number) => {
    setSelectedTypes(prev => prev.map(t => 
      t.type === type ? { ...t, timeLimit: Math.max(5, timeLimit) } : t
    ));
  }, []);

  const handleMinTimeChange = useCallback((type: string, minTime: number) => {
    setSelectedTypes(prev => prev.map(t => {
      if (t.type === type) {
        const validMinTime = Math.max(1, Math.min(minTime, t.timeLimit));
        return { ...t, minTime: validMinTime };
      }
      return t;
    }));
  }, []);

  const generateQuestions = useCallback(() => {
    let filteredQuestions: Question[] = [];
    selectedTypes.forEach(type => {
      if (type.count > 0) {
        let typeQuestions = questionsData.questions.filter(q => q.type === type.type);
        
        if (selectedTextbook && selectedTextbook !== 'all') {
          typeQuestions = typeQuestions.filter(q => q.textbook === selectedTextbook);
        }
        
        const shuffledQuestions = [...typeQuestions].sort(() => Math.random() - 0.5);
        const availableQuestions = shuffledQuestions.slice(0, type.count);
        
        if (availableQuestions.length < type.count) {
          alert(`警告：${type.type}类型的题目数量不足，仅找到${availableQuestions.length}道题`);
        }
        
        filteredQuestions = filteredQuestions.concat(
          availableQuestions.map(q => ({
            ...q,
            score: type.score,
            timeLimit: type.timeLimit,
            minTime: type.minTime
          }))
        );
      }
    });
    return filteredQuestions;
  }, [selectedTypes, selectedTextbook]);

  const startTest = useCallback(() => {
    const totalQuestions = selectedTypes.reduce((sum, type) => sum + type.count, 0);
    if (totalQuestions === 0) {
      alert("请至少选择一道题目");
      return;
    }

    let testQuestions: Question[];
    
    if (questionMode === 'unified' && sharedQuestions && sharedQuestions.length > 0) {
      testQuestions = sharedQuestions;
    } else {
      testQuestions = generateQuestions();
      
      if (questionMode === 'unified' && setSharedQuestions) {
        setSharedQuestions(testQuestions);
      }
    }
    
    if (testQuestions.length === 0) {
      alert("没有找到符合条件的题目");
      return;
    }

    const totalTime = testQuestions.reduce((sum, q) => sum + (q.timeLimit || 30), 0);
    const maxScore = testQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
    
    setCurrentQuestions(testQuestions);
    setAnswers({});
    setTimeLeft(totalTime);
    setIsTestActive(true);
    setIsTestStarted(true);
    setFlippedCards({});
    setCurrentQuestionIndex(0);
    setQuestionStartTime(Date.now());
    setCurrentScore(0);
    setMaxPossibleScore(maxScore);
  }, [questionMode, sharedQuestions, setSharedQuestions, generateQuestions, setIsTestStarted]);

  const handleSubmit = useCallback(() => {
    if (currentQuestions.length === 0 || hasSubmitted) return;

    try {
      setHasSubmitted(true);
      const endTime = new Date().toISOString();
      const details = currentQuestions.map(q => {
        const answer = answers[q.id];
        const userAnswer = testMode === 'input' 
          ? (answer?.value as string) || "" 
          : (answer?.value === true ? "正确" : "错误");
        
        const isCorrect = testMode === 'input'
          ? isCorrectAnswer(userAnswer, q.answer)
          : answer?.value === true;

        const score = testMode === 'input'
          ? (isCorrect ? (q.score || 0) : 0)
          : (answer?.score || 0);

        return {
          questionId: q.id,
          userAnswer,
          isCorrect,
          score,
          time: answer?.time || 0
        };
      });

      const totalScore = details.reduce((sum, detail) => sum + detail.score, 0);
      const maxPossibleScore = currentQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
      const isPerfectScore = totalScore === maxPossibleScore;

      const newTestHistory = {
        id: student.testHistory.length + 1,
        date: endTime.split('T')[0],
        score: totalScore,
        details: details
      };

      updateStudentTestHistory(newTestHistory);

      if (isPerfectScore) {
        setShowPerfectScore(true);
      } else {
        alert(`测试完成！总分：${totalScore}分`);
        resetTest();
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('提交测试时出错，请重试');
    }
  }, [
    currentQuestions,
    answers,
    testMode,
    student.testHistory.length,
    updateStudentTestHistory,
    resetTest,
    hasSubmitted
  ]);

  useEffect(() => {
    if (!hasSubmitted && testMode === 'card' && isTestActive && Object.keys(answers).length === currentQuestions.length) {
      handleSubmit();
    }
  }, [answers, currentQuestions.length, testMode, isTestActive, handleSubmit, hasSubmitted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!hasSubmitted && isTestActive && timeLeft === 0) {
      handleSubmit();
    } else if (isTestActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTestActive, handleSubmit, hasSubmitted]);

  useEffect(() => {
    if (isTestActive && testMode === 'card') {
      setQuestionStartTime(Date.now());
    }
  }, [isTestActive, currentQuestionIndex, testMode]);

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>持续训练</CardTitle>
          <CardDescription>更系统、更科学、更有效!</CardDescription>
        </CardHeader>
        <CardContent>
          <TestLayout
            isTestActive={isTestActive}
            configPanelProps={{
              questionMode,
              setQuestionMode,
              selectedTypes,
              handleTypeChange,
              handleCountChange,
              handleScoreChange,
              handleTimeLimitChange,
              handleMinTimeChange,
              testMode,
              setTestMode,
              startTest,
              sharedQuestions,
              selectedTextbook,
              setSelectedTextbook,
            }}
            contentProps={{
              testMode,
              timeLeft,
              currentScore,
              maxScore: maxPossibleScore,
              showEmoji,
              cardModeProps: {
                currentQuestion: currentQuestions[currentQuestionIndex],
                currentQuestionIndex,
                currentQuestions,
                flippedCards,
                handleAnswerChange,
              },
              inputModeProps: {
                questions: currentQuestions,
                answers,
                handleAnswerChange,
                handleSubmit,
              }
            }}
          />
        </CardContent>
      </Card>
      
      <PerfectScoreCelebration
        show={showPerfectScore}
        onAnimationEnd={() => {
          setShowPerfectScore(false);
          resetTest();
        }}
      />
    </>
  );
}