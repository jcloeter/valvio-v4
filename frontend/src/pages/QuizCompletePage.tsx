import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/QuizCompletePage.css';
import { QuizAttemptResponseDto } from '../api';

const QuizCompletePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizAttempt = location.state?.quizAttempt as QuizAttemptResponseDto;
  const { score, time, missedNotes } = location.state?.stats || { score: 0, time: 0, missedNotes: 0 };

  const handleReturnToQuizzes = () => {
    navigate('/');
  };

  const calculateScore = () => {
    const totalNotes = quizAttempt?.quiz?.length || 0;
    if (totalNotes === 0) return 0;
    if (missedNotes >= score) return 0;
    return Math.round(((score - missedNotes) / totalNotes) * 100);
  };

  const calculateAccuracy = () => { 
    return `${score - missedNotes}/${quizAttempt?.quiz?.length}`; 
  }

  return (
    <div className="quiz-complete-page">
      <div className="completion-card">
        <h1>Quiz Complete!</h1>
        <h2>{quizAttempt?.quiz?.name}</h2>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{calculateScore()}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{calculateAccuracy()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time</span>
            <span className="stat-value">{time}s</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Missed Notes</span>
            <span className="stat-value">{missedNotes}</span>
          </div>
        </div>

        <button className="return-button" onClick={handleReturnToQuizzes}>
          Return to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizCompletePage; 