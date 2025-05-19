// hooks/useWorkoutTimer.js
import { useState, useEffect } from 'react';

const useWorkoutTimer = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive]);

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
    if (!isWorkoutActive) {
      setElapsedTime(0);
      setCompletedExercises({});
    }
  };

  const toggleExerciseComplete = (exerciseId) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isWorkoutActive,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    toggleWorkout,
    completedExercises,
    toggleExerciseComplete,
  };
};

export default useWorkoutTimer;