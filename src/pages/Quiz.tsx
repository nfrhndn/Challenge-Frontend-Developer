import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { fetchQuizQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Loader2, AlertCircle, Clock, ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const Quiz = () => {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedRef = useRef(false);
  const [showMap, setShowMap] = useState(false);

  const {
    questions,
    fetchStatus,
    currentQuestionIndex,
    setQuestions,
    setFetchStatus,
    submitAnswer,
    goToQuestion,
    username,
    isPlaying,
    isFinished,
    config,
    timeRemaining,
    tick,
    finishQuiz,
    answers,
  } = useQuizStore();

  // Arahkan user sesuai status kuis
  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    if (!isPlaying && !isFinished) {
      navigate('/setup');
      return;
    }
    if (isFinished) {
      navigate('/results');
      return;
    }
  }, [username, isPlaying, isFinished, navigate]);

  // Ambil soal saat mount (kuis baru atau resume)
  const loadQuestions = useCallback(async () => {
    if (fetchedRef.current) return;
    if (questions.length > 0) {
      // Sudah ada soal (resume), tandai sukses
      if (fetchStatus !== 'success') {
        setFetchStatus('success');
      }
      return;
    }

    fetchedRef.current = true;
    setFetchStatus('loading');

    try {
      const data = await fetchQuizQuestions(
        config.amount,
        config.difficulty as 'easy' | 'medium' | 'hard' | '',
        'multiple'
      );
      setQuestions(data);
      setFetchStatus('success');
    } catch (error) {
      console.error(error);
      setFetchStatus('error');
      fetchedRef.current = false; // izinkan retry
    }
  }, [config, questions.length, fetchStatus, setFetchStatus, setQuestions]);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      loadQuestions();
    }
  }, [isPlaying, isFinished, loadQuestions]);

  // Timer — kurangi tiap detik
  const isTimeUp = timeRemaining <= 0;
  useEffect(() => {
    if (!isPlaying || fetchStatus !== 'success' || isTimeUp) return;

    timerRef.current = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, fetchStatus, isTimeUp, tick]);

  // Simpan otomatis via zustand persist

  // Tangani waktu habis
  useEffect(() => {
    if (isPlaying && timeRemaining <= 0 && fetchStatus === 'success') {
      finishQuiz();
    }
  }, [isPlaying, timeRemaining, fetchStatus, finishQuiz]);

  const handleAnswer = (answer: string) => {
    submitAnswer(answer);
  };

  const handleRetry = async () => {
    fetchedRef.current = false;
    setFetchStatus('idle');
    await loadQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigasi soal
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  // Selesaikan kuis manual
  const handleFinish = () => {
    finishQuiz();
  };

  // Tampilan loading
  if (fetchStatus === 'loading' || (fetchStatus === 'idle' && questions.length === 0)) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400 animate-pulse">Menyiapkan soal...</p>
        </div>
      </div>
    );
  }

  // Tampilan error
  if (fetchStatus === 'error') {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Oops!</h2>
          <p className="text-gray-400">Gagal mengambil soal. Server mungkin sedang sibuk.</p>
          <Button onClick={handleRetry} variant="primary" className="bg-emerald-600 hover:bg-emerald-500">
            Coba Lagi
          </Button>
          <Button onClick={() => navigate('/setup')} variant="ghost" className="mt-2 text-gray-500">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Styling timer lingkaran
  const timerPct = config.timeLimit > 0 ? timeRemaining / config.timeLimit : 0;
  const timerRadius = 18;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerOffset = timerCircumference - timerPct * timerCircumference;
  const timerColor = timeRemaining < 30 ? '#ef4444' : timeRemaining < 60 ? '#eab308' : '#10b981';
  const isTimeLow = timeRemaining < 30;

  // Semua soal dijawab, tunggu proses selesai
  if (!currentQuestion && questions.length > 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400">Menyelesaikan kuis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col relative">

      {/* Peta Soal — Panel Geser */}
      <AnimatePresence>
        {showMap && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMap(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#1e293b] border-r border-gray-700/50 z-50 flex flex-col shadow-2xl"
            >
              {/* Header Panel */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                <h3 className="font-bold text-white text-sm">Peta Soal</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Info Singkat */}
              <div className="p-4 border-b border-gray-700/30 flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
                  <span className="text-gray-400">Dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-700 border border-gray-600" />
                  <span className="text-gray-400">Belum ({questions.length - answeredCount})</span>
                </div>
              </div>

              {/* Grid Nomor Soal */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          goToQuestion(idx);
                          setShowMap(false);
                        }}
                        className={cn(
                          "w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 border",
                          isCurrent
                            ? "bg-emerald-500 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-500/30"
                            : isAnswered
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                              : "bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Selesai */}
              <div className="p-4 border-t border-gray-700/50">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-sm"
                  onClick={() => {
                    setShowMap(false);
                    handleFinish();
                  }}
                >
                  Selesaikan Kuis ({answeredCount}/{questions.length})
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {/* Tombol Peta Soal */}
            <button
              onClick={() => setShowMap(true)}
              className="w-8 h-8 rounded-lg bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors relative"
              title="Peta Soal"
            >
              <LayoutGrid className="w-4 h-4 text-gray-400" />
              {answeredCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold flex items-center justify-center">
                  {answeredCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-sm">
              😊
            </div>
            <span className="font-medium text-sm text-gray-300">{username}</span>
          </div>

          {/* Timer Lingkaran */}
          <div className="flex items-center gap-2.5">
            <div className={cn("relative w-10 h-10", isTimeLow && "animate-pulse")}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r={timerRadius} stroke="#1e293b" strokeWidth="3" fill="none" />
                <circle
                  cx="20" cy="20" r={timerRadius}
                  stroke={timerColor}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={timerCircumference}
                  strokeDashoffset={timerOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-4 h-4" style={{ color: timerColor }} />
              </div>
            </div>
            <span className={cn("font-mono font-bold text-xl", isTimeLow ? "text-red-400" : "text-white")}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-1.5 font-medium">
          <span>
            Soal <span className="text-white font-semibold">{currentQuestionIndex + 1}</span> dari{' '}
            <span className="text-white font-semibold">{questions.length}</span>
          </span>
          <span>
            Dijawab: <span className="text-emerald-400 font-semibold">{answeredCount}</span>
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(to right, #10b981, #14b8a6, #eab308)',
            }}
          />
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-center px-4 pb-8">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestionIndex]}
          />
        )}

        {/* Tombol Navigasi */}
        <div className="flex items-center justify-between mt-4 px-0">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
              currentQuestionIndex === 0
                ? "border-gray-800 text-gray-600 cursor-not-allowed"
                : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white text-sm font-semibold transition-all duration-200"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-amber-900/30"
            >
              Selesai
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
