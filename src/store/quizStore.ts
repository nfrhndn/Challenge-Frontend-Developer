import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface QuizConfig {
  amount: number;
  difficulty: 'easy' | 'medium' | 'hard' | '';
  type: 'multiple' | 'boolean' | '';
  timeLimit: number; // dalam detik
}

export interface QuizState {
  username: string | null;
  config: QuizConfig;
  isPlaying: boolean;
  isFinished: boolean;
  score: number;
  currentQuestionIndex: number;
  answers: Record<number, string>;
  questions: Question[];
  fetchStatus: 'idle' | 'loading' | 'success' | 'error';
  timeRemaining: number;
  startedAt: number | null;

  // Aksi
  setUsername: (name: string) => void;
  setConfig: (config: QuizConfig) => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  setQuestions: (questions: Question[]) => void;
  setFetchStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
  submitAnswer: (answer: string) => void;
  tick: () => void;
  finishQuiz: () => void;
  fullReset: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      username: null,
      config: {
        amount: 10,
        difficulty: '',
        type: 'multiple',
        timeLimit: 300,
      },
      isPlaying: false,
      isFinished: false,
      score: 0,
      currentQuestionIndex: 0,
      answers: {},
      questions: [],
      fetchStatus: 'idle',
      timeRemaining: 300,
      startedAt: null,

      setUsername: (name) => set({ username: name }),
      setConfig: (config) => set({ config }),

      startQuiz: () => {
        const { config } = get();
        set({
          isPlaying: true,
          isFinished: false,
          score: 0,
          currentQuestionIndex: 0,
          answers: {},
          questions: [],
          fetchStatus: 'idle',
          timeRemaining: config.timeLimit,
          startedAt: Date.now(),
        });
      },

      resetQuiz: () => set({
        isPlaying: false,
        isFinished: false,
        score: 0,
        currentQuestionIndex: 0,
        answers: {},
        questions: [],
        fetchStatus: 'idle',
        timeRemaining: 300,
        startedAt: null,
      }),

      setQuestions: (questions) => set({ questions }),
      setFetchStatus: (status) => set({ fetchStatus: status }),

      tick: () => {
        const { timeRemaining } = get();
        if (timeRemaining <= 1) {
          get().finishQuiz();
        } else {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      finishQuiz: () => set({ isFinished: true, isPlaying: false, timeRemaining: 0 }),

      submitAnswer: (answer) => {
        const { questions, currentQuestionIndex, score, answers } = get();
        const currentQuestion = questions[currentQuestionIndex];

        let newScore = score;
        if (currentQuestion && answer === currentQuestion.correct_answer) {
          newScore += 1;
        }

        const newAnswers = { ...answers, [currentQuestionIndex]: answer };
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
          // Kuis selesai
          set({
            answers: newAnswers,
            score: newScore,
            currentQuestionIndex: nextIndex,
            isFinished: true,
            isPlaying: false,
          });
        } else {
          set({
            answers: newAnswers,
            score: newScore,
            currentQuestionIndex: nextIndex,
          });
        }
      },

      fullReset: () => set({
        username: null,
        config: { amount: 10, difficulty: '', type: 'multiple', timeLimit: 300 },
        isPlaying: false,
        isFinished: false,
        score: 0,
        currentQuestionIndex: 0,
        answers: {},
        questions: [],
        fetchStatus: 'idle',
        timeRemaining: 300,
        startedAt: null,
      }),
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        username: state.username,
        config: state.config,
        isPlaying: state.isPlaying,
        isFinished: state.isFinished,
        score: state.score,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        questions: state.questions,
        timeRemaining: state.timeRemaining,
        startedAt: state.startedAt,
      }),
    }
  )
);
