import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/QuizPage.css';
import { Pitch, QuizAttemptResponseDto } from '../api';
import { createImageUrlFromPitchId } from '../util/createImageUrlFromPitchId';
import { extendPitchList } from '../util/extendPitchList';

const QuizPage: React.FC = () => {
  const location = useLocation();
  const quizAttempt = location.state?.quizAttempt as QuizAttemptResponseDto;

  const [valves, setValves] = useState({ first: false, second: false, third: false });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [pitchList, setPitchList] = useState<Pitch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current pitch index
  const [error, setError] = useState<boolean>(false);

  const noteImageUrl = useMemo(()=>{
    return createImageUrlFromPitchId(pitchList[currentIndex]?.id || '')
  }, [pitchList, currentIndex])

  useEffect(() => {
    const pitches = quizAttempt.quiz?.pitchList;
    const quizLength = quizAttempt.quiz?.length;

    if (pitches && quizLength) {
      const extendedPitchList: Pitch[] = extendPitchList(pitches, quizLength);
      setPitchList(extendedPitchList);
    } else {
      setError(true);
    }
  }, [quizAttempt]);

  // Handle key presses for J, K, L and Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j') setValves((prev) => ({ ...prev, first: true }));
      if (e.key === 'k') setValves((prev) => ({ ...prev, second: true }));
      if (e.key === 'l') setValves((prev) => ({ ...prev, third: true }));
      if (e.key === ' ') handleSubmit(); // Submit on spacebar press
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
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle valve click/touch
  const toggleValve = (valve: 'first' | 'second' | 'third') => {
    setValves((prev) => ({ ...prev, [valve]: !prev[valve] }));
  };

  // Handle submit action
  const handleSubmit = () => {
    console.log("submit")
    if (currentIndex >= pitchList.length) return; // Prevent submission if quiz is over

    const currentPitch = pitchList[currentIndex];
    const userInput = calculateUserInput(valves); // Calculate user input based on valve states

    console.log(valves)
    console.log(userInput);
    console.log(currentPitch.position?.toString());

    if (userInput === currentPitch.position?.toString()) {
        console.log("correct")
      setScore((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1); // Move to the next pitch
      setValves({ first: false, second: false, third: false }); // Reset valves
    } else {
      setMissedNotes((prev) => prev + 1);
    }
  };

  const calculateUserInput = (valves: { first: boolean; second: boolean; third: boolean }): string => {
    // Convert valve states to a string value
    let position = '';
    if (valves.first) position += '1';
    if (valves.second) position += '2';
    if (valves.third) position += '3';
    if (position === '') position = '0';
    return position;
  };

  return (
    <div className="quiz-page">
      <h3>{quizAttempt.quiz?.name}</h3>
      <div className="trackers">
        <div className="tracker">Score: {score}</div>
        <div className="tracker">Time: {time}s</div>
        <div className="tracker">Missed Notes: {missedNotes}</div>
      </div>
      <div className="music-note">
        {currentIndex < pitchList.length ? (
          <img
            src={noteImageUrl}
            alt={`Pitch ${currentIndex + 1}`}
          />
        ) : (
          <p>Quiz Complete!</p>
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
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default QuizPage;