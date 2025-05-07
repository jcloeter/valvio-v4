import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/QuizLoadingPage.css';
import { QuizControllerApi, Pitch, QuizAttemptResponseDto } from '../api';

const QuizLoadingPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>(); // Extract quizId from the URL
  const navigate = useNavigate();
  const quizController = new QuizControllerApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ quizAttempt ,setQuizAttempt] = useState<QuizAttemptResponseDto>();
  const [countdown, setCountdown] = useState(3); // 3-second countdown

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return;
      try {
        const { data } = await quizController.startQuiz(Number(quizId)); // Fetch quiz data
        setQuizAttempt(data);
        setLoading(false); // Mark loading as complete
      } catch (err: any) {
        setError(err.message); // Handle errors
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (!loading) {
      // Start the countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Redirect to QuizPage after 3 seconds
      const timer = setTimeout(() => {
        navigate(`/valvio-v4/quiz/${quizId}`, { state: { quizAttempt } });
      }, 3000);

      return () => {
        clearInterval(countdownInterval); // Cleanup countdown interval
        clearTimeout(timer); // Cleanup timer
      };
    }
  }, [loading, navigate, quizId]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="quiz-loading-page">
      <h1>Loading Quiz...</h1>
      <p>Your quiz will start in {countdown} seconds!</p>
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          style={{ width: `${(3 - countdown) * (100 / 3)}%` }} // Dynamically update width
        ></div>
      </div>
    </div>
  );
};

export default QuizLoadingPage;