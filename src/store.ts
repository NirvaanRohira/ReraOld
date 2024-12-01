import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizState, User, QuizSettings } from './types';

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  numberOfQuestions: 50,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      isQuizComplete: false,
      user: null,
      isDarkMode: false,
      quizSettings: DEFAULT_QUIZ_SETTINGS,

      setQuestions: (questions) =>
        set(() => ({
          questions,
          currentQuestionIndex: 0,
          userAnswers: {},
          isQuizComplete: false,
        })),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          userAnswers: { ...state.userAnswers, [questionId]: answer },
        })),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.questions.length - 1
          ),
        })),

      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      completeQuiz: () =>
        set(() => ({
          isQuizComplete: true,
        })),

      reset: () =>
        set(() => ({
          questions: [],
          currentQuestionIndex: 0,
          userAnswers: {},
          isQuizComplete: false,
        })),

      setUser: (user: User | null) =>
        set(() => ({
          user,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      updateQuizSettings: (settings) =>
        set((state) => ({
          quizSettings: { ...state.quizSettings, ...settings },
        })),
    }),
    {
      name: 'quiz-store',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        quizSettings: state.quizSettings,
      }),
    }
  )
);