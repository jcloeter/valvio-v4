import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/QuizLoadingPage.css';
import { QuizControllerApi, QuizAttemptResponseDto } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { createApiConfig } from '../config/apiConfig';

const QuizLoadingPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptResponseDto>();
  
  const initialCountdownSeconds = 3;
  const [countdown, setCountdown] = useState(initialCountdownSeconds);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) {
        setError("No Quiz ID provided.");
        setLoading(false);
        return;
      }
      
      if (!idToken) {
        // Token not ready yet
        return;
      }
      
      // Reset states for re-fetches if quizId changes
      setLoading(true);
      setError(null);
      setQuizAttempt(undefined);
      setCountdown(initialCountdownSeconds); // Reset countdown display

      try {
        const apiConfig = createApiConfig(idToken);
        const quizController = new QuizControllerApi(apiConfig);
        const { data } = await quizController.startQuiz(Number(quizId));
        setQuizAttempt(data);
      } catch (err: any) {
        setError(err.message || "Failed to load quiz data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, idToken]); // Added idToken as dependency

  useEffect(() => {
    if (loading || error) {
      // Don't start timers if still loading or if there's an error
      return;
    }

    // Ensure countdown state is correctly set for the start of the timer effect
    // This is important if the effect re-runs due to other dependencies changing after loading.
    if (countdown !== 0) { // Only set interval if countdown hasn't already reached 0
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);
    
        // Cleanup for interval
        return () => clearInterval(countdownInterval);
    }
  }, [loading, error, countdown]); // Triggers when loading/error state changes, or countdown itself changes.

 useEffect(() => {
    if (loading || error) {
      return;
    }
    
    if (countdown === 0) { // Redirect only when countdown hits zero
      const redirectTimer = setTimeout(() => {
        if (quizAttempt) {
          navigate(`/quiz/${quizId}`, { state: { quizAttempt } });
        } else {
          console.error("Quiz attempt data not available for redirect. Navigating back.");
          setError("Failed to prepare quiz. Please try again."); // User-facing error
        }
      }, 0); // Redirect immediately when countdown is 0
       return () => clearTimeout(redirectTimer);
    }
  }, [loading, error, countdown, navigate, quizId, quizAttempt]);


  if (error && !loading) { // Show error state clearly if loading is finished
    return (
      <div className="quiz-loading-page">
        <h1>Error Loading Quiz</h1>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="return-button-error" // Ensure this class is styled
        >
          Return to Quizzes
        </button>
      </div>
    );
  }
  
  // Calculate progress for the loading bar
  const progressPercent = !loading && countdown > 0 
    ? ((initialCountdownSeconds - countdown + 1) / initialCountdownSeconds) * 100 
    : (!loading && countdown === 0 ? 100 : 0);


  return (
    <div className="quiz-loading-page">
      {loading && <h1>Loading Quiz Data...</h1>}
      {!loading && !error && (
        <>
          <h1>Get Ready!</h1>
          <p>Your quiz will start in {countdown} seconds!</p>
        </>
      )}
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizLoadingPage;