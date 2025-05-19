// hooks/useWorkoutTimer.js
import { useState, useEffect } from 'react';
import { saveWorkoutSession } from '../utils/workoutStorage';

const useWorkoutTimer = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      setStartTime(new Date());
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

 const handleWorkoutToggle = async () => {
    const nowActive = !isWorkoutActive;
    setIsWorkoutActive(nowActive);
    
    if (nowActive) {
      // Iniciando el workout
      setElapsedTime(0);
      setCompletedExercises({});
      setStartTime(new Date());
      return { action: 'start' };
    } else {
      // Finalizando el workout
      setIsSaving(true);
      try {
        const endTime = new Date();
        const workoutData = {
          startTime,
          endTime,
          duration: elapsedTime,
          completedExercises,
          completionPercentage: calculateCompletionPercentage()
        };
        
        const saved = await saveWorkoutSession(workoutData);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { 
          action: 'stop',
          success: saved,
          workoutData 
        };
      } catch (error) {
        console.error('Error saving workout:', error);
        return { action: 'stop', success: false, error };
      } finally {
        setIsSaving(false);
      }
    }
  };

  const calculateCompletionPercentage = () => {
    const totalExercises = Object.keys(completedExercises).length;
    if (totalExercises === 0) return 0;
    const completedCount = Object.values(completedExercises).filter(Boolean).length;
    return Math.round((completedCount / totalExercises) * 100);
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
    handleWorkoutToggle, // Reemplazamos toggleWorkout por esta función mejorada
    completedExercises,
    toggleExerciseComplete,
    isSaving,
    completionPercentage: calculateCompletionPercentage(),
  };
};

export default useWorkoutTimer;