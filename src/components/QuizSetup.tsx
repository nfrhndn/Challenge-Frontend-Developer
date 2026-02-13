import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import type { QuizConfig } from '../store/quizStore';
import { Button } from './ui/Button';
import { BrainCircuit, Clock, Layers, Hash } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizSetupProps {
  onStart: () => void;
}

const QuizSetup = ({ onStart }: QuizSetupProps) => {
  const { username, config, setConfig } = useQuizStore();
  
  // Local state for configuration before saving
  const [localConfig, setLocalConfig] = useState<QuizConfig>(config);

  const handleStart = () => {
    setConfig(localConfig);
    onStart();
  };

  const updateConfig = (key: keyof QuizConfig, value: string | number) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const difficulties = [
    { id: '', label: 'Mixed', desc: 'All difficulties', icon: Layers },
    { id: 'easy', label: 'Easy', desc: 'Light questions', icon: BrainCircuit },
    { id: 'medium', label: 'Medium', desc: 'Good balance', icon: Hash },
    { id: 'hard', label: 'Hard', desc: 'For experts', icon: BrainCircuit },
  ];

  const amounts = [5, 10, 15, 20];

  const times = [
    { value: 60, label: '1 Mins' },
    { value: 120, label: '2 Mins' },
    { value: 300, label: '5 Mins' },
    { value: 600, label: '10 Mins' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl"
       >
         <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-primary/20 rounded-full">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <p className="text-gray-400 font-medium">Hello, <span className="text-white">{username || 'User'}</span>!</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Configure Your Quiz</h1>
         </div>

         <div className="space-y-8">
            {/* Difficulty Section */}
            <div>
                <label className="text-sm text-gray-400 font-medium mb-3 block">Difficulty Level</label>
                <div className="grid grid-cols-2 gap-3">
                    {difficulties.map((diff) => {
                        const Icon = diff.icon;
                        const isSelected = localConfig.difficulty === diff.id;
                        return (
                            <button
                                key={diff.id}
                                onClick={() => updateConfig('difficulty', diff.id)}
                                className={cn(
                                    "flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left hover:bg-gray-800/50",
                                    isSelected 
                                        ? "bg-gray-800/80 border-primary ring-1 ring-primary/50" 
                                        : "bg-transparent border-gray-700 hover:border-gray-600"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 mb-2", isSelected ? "text-primary" : "text-gray-500")} />
                                <span className={cn("font-semibold text-sm", isSelected ? "text-white" : "text-gray-300")}>{diff.label}</span>
                                <span className="text-xs text-gray-500">{diff.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Amount Section */}
            <div>
                <label className="text-sm text-gray-400 font-medium mb-3 block">Number of Questions</label>
                <div className="grid grid-cols-4 gap-3">
                    {amounts.map((amt) => (
                        <button
                           key={amt}
                           onClick={() => updateConfig('amount', amt)}
                           className={cn(
                               "py-3 rounded-xl border text-sm font-semibold transition-all duration-200",
                               localConfig.amount === amt
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                           )}
                        >
                            {amt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Section */}
            <div>
                <label className="text-sm text-gray-400 font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time Limit
                </label>
                <div className="grid grid-cols-4 gap-3">
                    {times.map((time) => (
                        <button
                           key={time.value}
                           onClick={() => updateConfig('timeLimit', time.value)}
                           className={cn(
                               "py-3 rounded-xl border text-sm font-semibold transition-all duration-200",
                               localConfig.timeLimit === time.value
                                ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                           )}
                        >
                            {time.label}
                        </button>
                    ))}
                </div>
            </div>

            <Button 
                variant="primary" 
                size="lg" 
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-transform"
                onClick={handleStart}
            >
                Start Quiz!
            </Button>
         </div>
       </motion.div>
    </div>
  );
};

export default QuizSetup;
