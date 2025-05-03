import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the quizId from the URL
import '../styles/QuizPage.css';
import { Pitch, QuizControllerApi, QuizResponseDto } from '../api'; // Import API and types

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>(); // Extract quizId from the URL
  const [valves, setValves] = useState({ first: false, second: false, third: false });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60); // 60 seconds timer
  const [missedNotes, setMissedNotes] = useState(0);
  const [pitches, setPitches] = useState<Pitch[]>([]); // State to store pitch data
  const [quiz, setQuiz] = useState<QuizResponseDto>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const quizController = new QuizControllerApi();

  // Fetch pitch data for the quiz
  useEffect(() => {
    const fetchPitches = async () => {
      if (!quizId) return; // Ensure quizId is available
      try {
        setLoading(true);
        const { data } = await quizController.getPitchesForQuiz(Number(quizId)); // Fetch pitch data
        setPitches(data?.pitchList); // Store the fetched pitches
        setQuiz(data);
      } catch (err: any) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [quizId]); // Re-run if quizId changes

  // Handle key presses for J, K, L
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j') setValves((prev) => ({ ...prev, first: true }));
      if (e.key === 'k') setValves((prev) => ({ ...prev, second: true }));
      if (e.key === 'l') setValves((prev) => ({ ...prev, third: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'j') setValves((prev) => ({ ...prev, first: false }));
      if (e.key === 'k') setValves((prev) => ({ ...prev, second: false }));
      if (e.key === 'l') setValves((prev) => ({ ...prev, third: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle valve click/touch
  const toggleValve = (valve: 'first' | 'second' | 'third') => {
    setValves((prev) => ({ ...prev, [valve]: !prev[valve] }));
  };

  if (loading) return <p>Loading pitch data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="quiz-page">
        <h3>{quiz?.name}</h3>
      <div className="trackers">
        <div className="tracker">Score: {score}</div>
        <div className="tracker">Time: {time}s</div>
        <div className="tracker">Missed Notes: {missedNotes}</div>
      </div>
      <div className="music-note">
        {pitches.length > 0 ? (
          <img src={"/fix-me"} alt={"pitch-data"} />
        ) : (
          <p>No pitch data available</p>
        )}
      </div>
      <div className="valves">
        <div
          className={`valve ${valves.first ? 'pressed' : ''}`}
          onClick={() => toggleValve('first')}
        >
          1
        </div>
        <div
          className={`valve ${valves.second ? 'pressed' : ''}`}
          onClick={() => toggleValve('second')}
        >
          2
        </div>
        <div
          className={`valve ${valves.third ? 'pressed' : ''}`}
          onClick={() => toggleValve('third')}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default QuizPage;