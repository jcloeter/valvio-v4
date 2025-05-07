import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/QuizList.css'; 
import { QuizControllerApi, QuizResponseDto } from '../api';


const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const quizController = new QuizControllerApi();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await quizController.getAllQuizzes();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Group quizzes by quizUnitName
  const groupedQuizzes = quizzes.reduce((acc: Record<string, QuizResponseDto[]>, quiz) => {
    if (quiz.quizUnitName) {
      if (!acc[quiz.quizUnitName]) {
        acc[quiz.quizUnitName] = [];
      }
      acc[quiz.quizUnitName].push(quiz);
    }

    return acc;
  }, {});

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="quiz-list">
      {Object.entries(groupedQuizzes).map(([unitName, quizzes]) => (
        <div key={unitName} className="quiz-unit">
          <h2>{unitName}</h2>
          <div className="quiz-cards">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-card"
                onClick={() => navigate(`/valvio-v4/loading/${quiz.id}`)} // Navigate on click
                style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
              >
                <h3>{quiz.name}</h3>
                <p>Level: {quiz.level}</p>
                <span className={`quiz-tag ${quiz.quizTypeName?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {quiz.quizTypeName}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizList;