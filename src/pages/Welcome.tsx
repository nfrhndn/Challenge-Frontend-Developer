import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BrainCircuit } from 'lucide-react';

export default function Welcome() {
  const [name, setName] = useState('');
  const setUsername = useQuizStore((state) => state.setUsername);
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setUsername(name);
    // Don't start quiz yet, let user configure it first
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gray-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-gray-800 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl mb-6 shadow-inner ring-1 ring-white/10"
          >
            <BrainCircuit className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-gray-400 bg-clip-text text-transparent text-center mb-2">
            Quiz Master
          </h1>
          <p className="text-gray-400 text-center text-sm font-medium tracking-wide uppercase opacity-80">
            Frontend Challenge
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
              Identify Yourself
            </label>
            <Input
              id="name"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 h-14 text-lg px-4 transition-all duration-300 hover:border-gray-700"
              autoFocus
              autoComplete="off"
            />
          </div>

          <Button 
            variant="primary"
            size="lg"
            type="submit" 
            className="w-full h-14 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
            disabled={!name.trim()}
          >
            Start Challenge
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-xs text-gray-600 font-medium">
            Designed for <span className="text-gray-400">excellence</span> in every detail.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
