import { useState, useCallback } from 'react';
import { Question, QuestionType, TestHistory, Student } from '@/lib/types';
import questionsData from '@/data/questions.json';

// Helper function to validate answer
function isCorrectAnswer(userAnswer: string, correctAnswer: string | string[]): boolean {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(answer => 
      normalizedUserAnswer === String(answer).toLowerCase().trim()
    );
  }
  
  return normalizedUserAnswer === String(correctAnswer).toLowerCase().trim();
}

export function useTestState(
  student: Student,
  updateStudentTestHistory: (newTestHistory: TestHistory) => void,
  setIsTestStarted: (isStarted: boolean) => void,
  sharedQuestions?: Question[],
  setSharedQuestions?: (questions: Question[]) => void,
) {
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    { type: "单词", count: 1, score: 25, timeLimit: 5, minTime: 2 },
    { type: "短语", count: 1, score: 25, timeLimit: 5, minTime: 2 },
    { type: "句子", count: 1, score: 25, timeLimit: 8, minTime: 3 },
    { type: "语法", count: 1, score: 25, timeLimit: 8, minTime: 3 }
  ]);
  const [testMode, setTestMode] = useState<'input' | 'card'>('input');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    if (hasSubmitted) return;

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
      
      const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
      if (isLastQuestion && value === true) {
        setHasSubmitted(true);
      }
      
      setTimeout(() => {
        setShowEmoji(false);
        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setQuestionStartTime(Date.now());
        }
      }, 1000);
    }
  }, [
    testMode, 
    questionStartTime, 
    currentQuestions, 
    currentQuestionIndex, 
    answers, 
    calculateScore,
    hasSubmitted
  ]);

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
        const typeQuestions = questionsData.questions.filter(q => q.type === type.type);
        const shuffledQuestions = [...typeQuestions].sort(() => Math.random() - 0.5);
        const availableQuestions = shuffledQuestions.slice(0, type.count);
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
  }, [selectedTypes]);

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
  }, [questionMode, sharedQuestions, setSharedQuestions, generateQuestions, setIsTestStarted, selectedTypes]);

  const handleSubmit = useCallback(() => {
    if (currentQuestions.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const endTime = new Date().toISOString();
      const details = currentQuestions.map(q => {
        const answer = answers[q.id];
        const userAnswer = testMode === 'input' 
          ? String(answer?.value || '').trim()
          : (answer?.value === true ? "正确" : "错误");

        const isCorrect = testMode === 'input'
          ? isCorrectAnswer(userAnswer, q.answer)
          : answer?.value === true;

        const score = testMode === 'input'
          ? (isCorrect ? q.score : 0)
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
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentQuestions,
    answers,
    testMode,
    student.testHistory.length,
    updateStudentTestHistory,
    resetTest,
    isSubmitting
  ]);

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
    setHasSubmitted(false);
    setIsTestStarted(false);
  }, [setIsTestStarted]);

  return {
    selectedTypes,
    testMode,
    questionMode,
    currentQuestions,
    answers,
    timeLeft,
    isTestActive,
    flippedCards,
    currentQuestionIndex,
    showEmoji,
    currentScore,
    showPerfectScore,
    maxPossibleScore,
    isSubmitting,
    setTestMode,
    setQuestionMode,
    handleTypeChange,
    handleCountChange,
    handleScoreChange,
    handleTimeLimitChange,
    handleMinTimeChange,
    handleAnswerChange,
    startTest,
    handleSubmit,
    resetTest,
    setTimeLeft,
    setShowPerfectScore,
  };
}