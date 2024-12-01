export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSettings {
  numberOfQuestions: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  isQuizComplete: boolean;
  user: User | null;
  isDarkMode: boolean;
  quizSettings: QuizSettings;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  reset: () => void;
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  updateQuizSettings: (settings: Partial<QuizSettings>) => void;
}