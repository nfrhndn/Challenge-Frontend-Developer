import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuizState {
  username: string | null;
  isPlaying: boolean;
  score: number;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionIndex -> answer
  
  // Actions
  setUsername: (name: string) => void;
  startQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      username: null,
      isPlaying: false,
      score: 0,
      currentQuestionIndex: 0,
      answers: {},

      setUsername: (name) => set({ username: name }),
      startQuiz: () => set({ isPlaying: true, score: 0, currentQuestionIndex: 0, answers: {} }),
      resetQuiz: () => set({ isPlaying: false, score: 0, currentQuestionIndex: 0, answers: {} }),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
