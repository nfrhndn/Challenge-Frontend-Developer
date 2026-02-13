import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import type { QuizConfig } from '../store/quizStore';
import { Button } from '../components/ui/Button';
import { Sparkles, Zap, BookOpen, Flame, Layers, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Setup() {
  const navigate = useNavigate();
  const { username, config, setConfig, startQuiz } = useQuizStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  const updateConfig = (key: keyof QuizConfig, value: string | number) => {
    setConfig({ ...config, [key]: value });
  };

  const handleStartQuiz = () => {
    startQuiz(); // sets isPlaying=true, resets score/answers/etc
    // Navigate to quiz with config as query params
    const params = new URLSearchParams();
    params.set('amount', String(config.amount));
    if (config.difficulty) params.set('difficulty', config.difficulty);
    params.set('type', config.type || 'multiple');
    params.set('time', String(config.timeLimit));
    navigate(`/quiz?${params.toString()}`);
  };

  const difficulties = [
    { id: '', label: 'Campuran', desc: 'Semua tingkat kesulitan', icon: Layers },
    { id: 'easy', label: 'Mudah', desc: 'Pertanyaan ringan', icon: BookOpen },
    { id: 'medium', label: 'Sedang', desc: 'Tantangan menengah', icon: Zap },
    { id: 'hard', label: 'Sulit', desc: 'Untuk yang berani', icon: Flame },
  ];

  const amounts = [5, 10, 15, 20];

  const times = [
    { value: 60, label: '1 Menit' },
    { value: 120, label: '2 Menit' },
    { value: 300, label: '5 Menit' },
    { value: 600, label: '10 Menit' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <span className="text-lg">😊</span>
            </div>
            <p className="text-gray-400 font-medium">
              Halo, <span className="text-white font-semibold">{username || 'User'}</span>!
            </p>
          </div>
          <h1 className="text-2xl font-bold text-white">Atur Kuis Kamu</h1>
        </div>

        {/* Config Card */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl space-y-7">
          {/* Difficulty */}
          <div>
            <label className="text-sm text-gray-400 font-medium mb-3 block">Tingkat Kesulitan</label>
            <div className="grid grid-cols-2 gap-3">
              {difficulties.map((diff) => {
                const Icon = diff.icon;
                const isSelected = config.difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => updateConfig('difficulty', diff.id)}
                    className={cn(
                      "flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                      isSelected
                        ? "bg-[#1e293b] border-emerald-500 ring-1 ring-emerald-500/30"
                        : "bg-transparent border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mb-1.5", isSelected ? "text-emerald-400" : "text-gray-500")} />
                    <span className={cn("font-semibold text-sm", isSelected ? "text-white" : "text-gray-300")}>{diff.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{diff.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-gray-400 font-medium mb-3 block">Jumlah Soal</label>
            <div className="grid grid-cols-4 gap-3">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => updateConfig('amount', amt)}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-semibold transition-all duration-200",
                    config.amount === amt
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                      : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                  )}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Waktu Pengerjaan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {times.map((time) => (
                <button
                  key={time.value}
                  onClick={() => updateConfig('timeLimit', time.value)}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-semibold transition-all duration-200",
                    config.timeLimit === time.value
                      ? "bg-amber-500/15 border-amber-500 text-amber-400"
                      : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                  )}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full h-13 text-base font-bold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 rounded-xl"
            onClick={handleStartQuiz}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Mulai Kuis!
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
