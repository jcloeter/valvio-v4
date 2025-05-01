import React, { useEffect, useState } from 'react';
import '../styles/QuizList.css'; 

interface Quiz {
  id: number;
  name: string;
  quizUnitName: string;
  quizTypeName: string;
  level: number;
  length: number;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:8080/quiz');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
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
  const groupedQuizzes = quizzes.reduce((acc: Record<string, Quiz[]>, quiz) => {
    if (!acc[quiz.quizUnitName]) {
      acc[quiz.quizUnitName] = [];
    }
    acc[quiz.quizUnitName].push(quiz);
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
                <span className={`quiz-tag ${quiz.quizTypeName.toLowerCase().replace(/\s+/g, '-')}`}>
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