import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../store/quizStore';
import { cn } from '../lib/utils';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full px-6 py-4">
      {/* Category & Difficulty Badges */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-400 text-sm font-medium tracking-wide">
          {decodeHTML(question.category)}
        </span>
        <span className={cn(
          "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
          question.difficulty === 'easy' ? "text-green-400 bg-green-400/10" :
          question.difficulty === 'medium' ? "text-yellow-400 bg-yellow-400/10" :
          question.difficulty === 'hard' ? "text-red-400 bg-red-400/10" : "text-gray-400"
        )}>
          {question.difficulty}
        </span>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={question.question}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
            {decodeHTML(question.question)}
          </h2>

          <div className="grid gap-4">
            {question.all_answers.map((answer, index) => (
              <button
                key={index}
                className="group relative w-full flex items-center p-4 rounded-xl border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-primary/50 transition-all duration-200 text-left overflow-hidden"
                onClick={() => onAnswer(answer)}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-200 mr-4 z-10">
                  {optionLabels[index] || '?'}
                </div>
                <span className="text-gray-300 font-medium text-base md:text-lg group-hover:text-white transition-colors z-10 flex-1">
                  {decodeHTML(answer)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;
