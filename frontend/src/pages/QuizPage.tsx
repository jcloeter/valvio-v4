import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';
import { Pitch, QuizAttemptResponseDto } from '../api';
import { createImageUrlFromPitchId } from '../util/createImageUrlFromPitchId';
import { extendPitchList } from '../util/extendPitchList';
import Modal from '../components/Modal';

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizAttempt = location.state?.quizAttempt as QuizAttemptResponseDto;

  const [valves, setValves] = useState({ first: false, second: false, third: false });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [pitchList, setPitchList] = useState<Pitch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current pitch index
  const [error, setError] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitDestination, setExitDestination] = useState('/valvio-v4');

  const isQuizComplete = useMemo(()=>{

    if (pitchList.length === 0) {
      return false;
    }

    return currentIndex >= pitchList.length
  }, [currentIndex, pitchList.length]);

  console.log("isQuizComplete? " + isQuizComplete);

  const noteImageUrl = useMemo(()=>{
    return createImageUrlFromPitchId(pitchList[currentIndex]?.id || '')
  }, [pitchList, currentIndex])

  useEffect(() => {
    const pitches = quizAttempt?.quiz?.pitchList;
    const quizLength = quizAttempt?.quiz?.length;

    if (pitches && quizLength) {

      if (quizAttempt.quiz?.quizTypeName !== 'scale'){
        const extendedPitchList: Pitch[] = extendPitchList(pitches, quizLength);
        console.log("Setting pitch list as ");
        console.log(extendedPitchList);
        setPitchList(extendedPitchList);
      }else {
        setPitchList(pitches);
      }

    } else {
      console.log("Missing required data:", { pitches, quizLength });
      setError(true);
    }
  }, [quizAttempt]);

  useEffect(()=>{
    if (isQuizComplete) {
      console.log("Quiz is complete");
      navigate('/complete', {
        state: {
          quizAttempt,
          stats: {
            score,
            time,
            missedNotes
          }
        }
      });
      return;
    }
  }, [isQuizComplete, missedNotes, navigate, quizAttempt, score, time])

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
  const handleSubmit = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    const currentPitch = pitchList[currentIndex];
    if (!currentPitch) {
      console.error("No pitch found at index:", currentIndex);
      return;
    }

    const userInput = calculateUserInput(valves); // Calculate user input based on valve states

    if (userInput === currentPitch.position?.toString()) {
      setScore((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1); // Move to the next pitch
      setValves({ first: false, second: false, third: false }); // Reset valves
    } else {
      setMissedNotes((prev) => prev + 1);
    }
  }, [currentIndex, pitchList, valves, navigate, quizAttempt, score, time, missedNotes]);

  const calculateUserInput = (valves: { first: boolean; second: boolean; third: boolean }): string => {
    // Convert valve states to a string value
    let position = '';
    if (valves.first) position += '1';
    if (valves.second) position += '2';
    if (valves.third) position += '3';
    if (position === '') position = '0';
    return position;
  };


  // Handle key presses for J, K, L and Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j') setValves((prev) => ({ ...prev, first: true }));
      if (e.key === 'k') setValves((prev) => ({ ...prev, second: true }));
      if (e.key === 'l') setValves((prev) => ({ ...prev, third: true }));
      if (e.key === ' ') handleSubmit(e); // Submit on spacebar press
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
  }, [handleSubmit]);

  // Function to show exit confirmation
  const showExitConfirmation = (destination: string = '/') => {
    setExitDestination(destination);
    setShowExitModal(true);
  };
  
  // Function to execute navigation when confirmed
  const handleExitConfirm = () => {
    navigate(exitDestination);
  };
  
  // Modal actions
  const exitModalActions = (
    <>
      <button 
        className="modal-button-secondary" 
        onClick={() => setShowExitModal(false)}
      >
        Stay
      </button>
      <button 
        className="modal-button-primary" 
        onClick={handleExitConfirm}
      >
        Leave Anyway
      </button>
    </>
  );

  // Add beforeunload event handler for browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentIndex < pitchList.length && pitchList.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentIndex, pitchList.length]);

  return (
    <div className="quiz-page">
      <h3>{quizAttempt.quiz?.name}</h3>
      <div className="trackers">
        <div className="tracker">Score: {score}</div>
        <div className="tracker">Time: {time}s</div>
        <div className="tracker">Missed Notes: {missedNotes}</div>
      </div>
      <div className="music-note">
        {isQuizComplete ? (
          <p>Quiz Complete!</p>
        ) : (
          <img
            src={noteImageUrl}
            alt={`Pitch ${currentIndex + 1}`}
          />
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
      <button
        className="back-button"
        onClick={() => showExitConfirmation()}
      >
        Back to Quizzes
      </button>
      
      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Leave Quiz?"
        actions={exitModalActions}
      >
        <p>Your progress will be lost if you leave this page now.</p>
        <p>Are you sure you want to exit?</p>
      </Modal>
    </div>
  );
};

export default QuizPage;