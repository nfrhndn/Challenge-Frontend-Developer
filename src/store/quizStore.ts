import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[]; // Shuffled answers
}

export interface QuizConfig {
  amount: number;
  difficulty: 'easy' | 'medium' | 'hard' | ''; // Empty for mixed
  type: 'multiple' | 'boolean' | ''; // Empty for mixed (though mainly multiple)
  timeLimit: number; // in seconds
}

export interface QuizState {
  username: string | null;
  config: QuizConfig;
  isPlaying: boolean;
  score: number;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionIndex -> answer
  questions: Question[];
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
  
  // Actions
  setUsername: (name: string) => void;
  setConfig: (config: QuizConfig) => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  setQuestions: (questions: Question[]) => void;
  setFetchStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
  submitAnswer: (answer: string) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      username: null,
      config: {
        amount: 10,
        difficulty: '',
        type: 'multiple',
        timeLimit: 300, // Default 5 mins
      },
      isPlaying: false,
      score: 0,
      currentQuestionIndex: 0,
      answers: {},
      questions: [],
      fetchStatus: 'idle',

      setUsername: (name) => set({ username: name }),
      setConfig: (config) => set({ config }),
      startQuiz: () => set({ 
        isPlaying: true, 
        score: 0, 
        currentQuestionIndex: 0, 
        answers: {},
        fetchStatus: 'idle' // Reset status so we can fetch again if needed
      }),
      resetQuiz: () => set({ 
        isPlaying: false, 
        score: 0, 
        currentQuestionIndex: 0, 
        answers: {},
        questions: [],
        fetchStatus: 'idle'
      }),
      setQuestions: (questions) => set({ questions }),
      setFetchStatus: (status) => set({ fetchStatus: status }),
      
      submitAnswer: (answer) => {
        const { questions, currentQuestionIndex, score, answers } = get();
        const currentQuestion = questions[currentQuestionIndex];
        
        let newScore = score;
        if (currentQuestion && answer === currentQuestion.correct_answer) {
          newScore += 1;
        }

        set({
          answers: { ...answers, [currentQuestionIndex]: answer },
          score: newScore,
          currentQuestionIndex: currentQuestionIndex + 1,
        });
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        username: state.username,
        config: state.config,
        isPlaying: state.isPlaying,
        score: state.score,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        questions: state.questions,
      }),
    }
  )
);
