import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { fetchQuizQuestions } from '../services/api';
import QuestionCard from '../components/QuestionCard';
import QuizSetup from '../components/QuizSetup';
import { Loader2, AlertCircle, Clock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Quiz = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    fetchStatus, 
    currentQuestionIndex, 
    setQuestions, 
    setFetchStatus,
    submitAnswer,
    username,
    isPlaying,
    config,
    startQuiz,
    score
  } = useQuizStore();

  useEffect(() => {
    // Redirect if no username (must go through welcome)
    if (!username) {
      navigate('/');
      return;
    }
  }, [username, navigate]);

  const handleStartGame = async () => {
    // Start Quiz Action (sets isPlaying=true)
    startQuiz();
    setFetchStatus('loading');
    
    try {
      // Use config for fetching
      const data = await fetchQuizQuestions(config.amount, config.difficulty as any, 'multiple'); // force multiple for now as per design
      setQuestions(data);
      setFetchStatus('success');
    } catch (error) {
      console.error(error);
      setFetchStatus('error');
    }
  };

  const handleAnswer = (answer: string) => {
    submitAnswer(answer);
    
    if (currentQuestionIndex + 1 >= questions.length) {
       // Navigate to results (Next Phase)
       console.log("Quiz Finished!");
    }
  };

  // 1. Setup Screen
  if (!isPlaying) {
    return <QuizSetup onStart={handleStartGame} />;
  }

  // 2. Loading State
  if (fetchStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-gray-400 animate-pulse">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  // 3. Error State
  if (fetchStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Oops!</h2>
          <p className="text-gray-400">Failed to load questions. Open Trivia DB might be busy.</p>
          <Button onClick={handleStartGame} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost" className="mt-2 text-gray-500">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // 4. Finished State (Temporary)
  if (currentQuestionIndex >= questions.length && questions.length > 0) {
     return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Quiz Completed!</h2>
            <div className="text-xl text-primary font-bold">Score: {score} / {questions.length}</div>
            <p className="text-gray-400">Results page coming in Phase 4.</p>
            <Button onClick={() => navigate('/')} variant="outline">Back to Home</Button>
        </div>
        </div>
     );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Format Time (Placeholder for now)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
       
       {/* Simple Header */}
       <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="w-4 h-4 text-primary" />
             </div>
             <span className="font-medium text-sm text-gray-300">{username}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
             <Clock className="w-4 h-4 text-green-400" />
             <span className="font-mono font-bold text-lg text-white">
                {formatTime(config.timeLimit)}
             </span>
          </div>
       </header>

       {/* Progress Bar */}
       <div className="w-full max-w-2xl mt-8 px-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2 font-medium">
             <span>Question <span className="text-white">{currentQuestionIndex + 1}</span> of {questions.length}</span>
             <span>Answered: {currentQuestionIndex}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-teal-500 to-green-500 transition-all duration-500 ease-out rounded-full"
               style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
             />
          </div>
       </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl relative z-10 flex flex-col justify-center pb-20">
        {currentQuestion ? (
          <QuestionCard 
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        ) : (
            <div className="text-center w-full">Something went wrong...</div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
