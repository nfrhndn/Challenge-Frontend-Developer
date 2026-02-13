import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { fetchQuizQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Loader2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const Quiz = () => {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedRef = useRef(false);

  const {
    questions,
    fetchStatus,
    currentQuestionIndex,
    setQuestions,
    setFetchStatus,
    submitAnswer,
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
  const progressPct = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

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
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-4 pt-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
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
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-center pb-16">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}
      </main>
    </div>
  );
};

export default Quiz;
