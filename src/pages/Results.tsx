import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../components/ui/Button';
import { Trophy, CheckCircle, XCircle, MinusCircle, RotateCcw, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

export default function Results() {
  const navigate = useNavigate();
  const { username, questions, answers, score, resetQuiz, fullReset, isFinished } = useQuizStore();

  useEffect(() => {
    if (!isFinished || questions.length === 0) {
      navigate('/');
    }
  }, [isFinished, questions.length, navigate]);

  if (!isFinished || questions.length === 0) return null;

  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const total = questions.length;
  const correct = score;
  const answered = Object.keys(answers).length;
  const wrong = answered - correct;
  const skipped = total - answered;
  const percentage = Math.round((correct / total) * 100);

  // Determine message
  const getMessage = () => {
    if (percentage >= 80) return { text: 'Luar Biasa! 🎉', color: 'text-emerald-400' };
    if (percentage >= 50) return { text: 'Bagus! 👍', color: 'text-yellow-400' };
    return { text: 'Coba Lagi 💪', color: 'text-red-400' };
  };
  const msg = getMessage();

  const handlePlayAgain = () => {
    resetQuiz();
    navigate('/setup');
  };

  const handleLogout = () => {
    fullReset();
    navigate('/');
  };

  // SVG circle for percentage
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Score Card */}
        <div className="bg-[#1e293b]/70 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-8 text-center mb-8 mt-6">
          {/* Trophy */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/10 rounded-full ring-1 ring-amber-500/20">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h1 className={cn("text-3xl font-bold mb-1", msg.color)}>{msg.text}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs border border-cyan-500/30">😊</div>
            <span className="text-sm">{username}</span>
          </div>

          {/* Circular Score */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} stroke="#1e293b" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="60" cy="60" r={radius}
                  stroke={percentage >= 80 ? '#10b981' : percentage >= 50 ? '#eab308' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-400">{correct}</div>
              <div className="text-xs text-gray-400">Benar</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-red-400">{wrong}</div>
              <div className="text-xs text-gray-400">Salah</div>
            </div>
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
              <MinusCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-400">{skipped}</div>
              <div className="text-xs text-gray-400">Dilewati</div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Review Jawaban</h2>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct_answer;
              const isSkipped = userAnswer === undefined;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border",
                    isSkipped
                      ? "bg-[#1e293b]/40 border-gray-700/40"
                      : isCorrect
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20"
                  )}
                >
                  {/* Number */}
                  <div className={cn(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5",
                    isSkipped
                      ? "bg-gray-700 text-gray-400"
                      : isCorrect
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                  )}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium mb-1 leading-relaxed">
                      {decodeHTML(q.question)}
                    </p>
                    {!isSkipped && (
                      <p className={cn("text-xs", isCorrect ? "text-emerald-400" : "text-red-400")}>
                        <span className={isCorrect ? "" : "line-through opacity-60"}>
                          Jawaban kamu: {decodeHTML(userAnswer)}
                        </span>
                      </p>
                    )}
                    {(!isCorrect || isSkipped) && (
                      <p className="text-xs text-emerald-400">
                        Jawaban benar: {decodeHTML(q.correct_answer)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-10">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold"
            onClick={handlePlayAgain}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Main Lagi
          </Button>
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
