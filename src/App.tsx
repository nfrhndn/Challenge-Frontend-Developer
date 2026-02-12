import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';

// Placeholder for future phases
const Quiz = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-primary">Work In Progress</h2>
      <p className="text-gray-400">The quiz engine will be implemented in the next phase.</p>
      <a href="/" className="text-primary hover:underline">Go Back</a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
