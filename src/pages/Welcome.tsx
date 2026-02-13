import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Brain } from 'lucide-react';

export default function Welcome() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const setUsername = useQuizStore((s) => s.setUsername);
  const existingUsername = useQuizStore((s) => s.username);
  const isPlaying = useQuizStore((s) => s.isPlaying);
  const timeRemaining = useQuizStore((s) => s.timeRemaining);
  const questions = useQuizStore((s) => s.questions);

  // Jika sudah login, arahkan ke setup atau resume kuis
  React.useEffect(() => {
    if (existingUsername) {
      if (isPlaying && questions.length > 0 && timeRemaining > 0) {
        navigate('/quiz'); // Lanjutkan kuis yang belum selesai
      } else {
        navigate('/setup'); // Sudah login, langsung ke setup
      }
    }
  }, [existingUsername, isPlaying, questions.length, timeRemaining, navigate]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUsername(name.trim());
    navigate('/setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4 overflow-hidden relative">
      {/* Efek cahaya */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="p-4 bg-emerald-500/10 rounded-2xl mb-5 ring-1 ring-emerald-500/20"
          >
            <Brain className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
          </motion.div>
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tight mb-1">
            QuizMania
          </h1>
          <p className="text-gray-400 text-sm">
            ✨ Uji pengetahuanmu sekarang
          </p>
        </div>

        {/* Kartu Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl"
        >
          <form onSubmit={handleStart} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-400">
                Nama Pengguna
              </label>
              <Input
                id="name"
                placeholder="Masukkan nama kamu..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0f172a]/60 border-gray-700 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12"
                autoFocus
                autoComplete="off"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 rounded-xl"
              disabled={!name.trim()}
            >
              Mulai Quiz →
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
