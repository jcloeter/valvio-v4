import React, { useEffect, useState } from 'react';
import '../styles/QuizList.css'; 
import { QuizControllerApi, QuizResponseDto } from '../api';

interface Quiz {
  id: number;
  name: string;
  quizUnitName: string;
  quizTypeName: string;
  level: number;
  length: number;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const quizController = new QuizControllerApi();



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
    if (quiz.quizUnitName){
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
              <div key={quiz.id} className="quiz-card">
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