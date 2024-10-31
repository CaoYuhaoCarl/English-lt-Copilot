export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  testHistory: TestHistory[];
}

export interface TestHistory {
  id: number;
  date: string;
  score: number;
  details: TestDetail[];
}

export interface TestDetail {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
  time: number;
}

export interface Question {
  id: number;
  type: string;
  question: string;
  answer: string | string[];
  textbook?: string;
  keyPoint: string;
  ability: string;
  score?: number;
  timeLimit?: number;
  minTime?: number;
}

export interface QuestionType {
  type: string;
  count: number;
  score: number;
  timeLimit: number;
  minTime: number;
}

export interface StudentFilters {
  grade: string;
  class: string;
  searchQuery: string;
}