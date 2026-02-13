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
  const optionColors = [
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'bg-rose-500/20 text-rose-400 border-rose-500/30',
  ];

  return (
    <div className="w-full px-4 py-4">
      {/* Category & Difficulty */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-gray-400 text-sm font-medium">
          {decodeHTML(question.category)}
        </span>
        <span className={cn(
          "text-xs font-bold uppercase tracking-wider",
          question.difficulty === 'easy' ? "text-green-400" :
          question.difficulty === 'medium' ? "text-yellow-400" :
          "text-red-400"
        )}>
          {question.difficulty === 'easy' ? 'Easy' :
           question.difficulty === 'medium' ? 'Medium' : 'Hard'}
        </span>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={question.question}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question */}
          <div className="bg-[#1e293b]/60 border border-gray-700/40 rounded-xl p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
              {decodeHTML(question.question)}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.all_answers.map((answer, index) => (
              <button
                key={index}
                className="group w-full flex items-center p-4 rounded-xl border border-gray-700/50 bg-[#1e293b]/40 hover:bg-[#1e293b]/80 hover:border-emerald-500/30 transition-all duration-200 text-left"
                onClick={() => onAnswer(answer)}
              >
                <div className={cn(
                  "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold mr-4 border transition-colors",
                  optionColors[index] || 'bg-gray-700 text-gray-300'
                )}>
                  {optionLabels[index]}
                </div>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors flex-1">
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
