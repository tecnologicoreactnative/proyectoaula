// utils/workoutStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUT_SESSIONS_KEY = '@workout_sessions';

export const saveWorkoutSession = async (session) => {
  try {
    const existingSessions = await getWorkoutSessions();
    const updatedSessions = [...existingSessions, {
      ...session,
      // Aseguramos que la fecha esté en formato YYYY-MM-DD
      date: new Date(session.startTime).toISOString().split('T')[0],
      // Añadimos día de la semana (0 = Domingo, 6 = Sábado)
      dayOfWeek: new Date(session.startTime).getDay(),
      // Añadimos mes (0 = Enero, 11 = Diciembre)
      month: new Date(session.startTime).getMonth()
    }];
    await AsyncStorage.setItem(WORKOUT_SESSIONS_KEY, JSON.stringify(updatedSessions));
    return true;
  } catch (error) {
    console.error('Error saving workout session:', error);
    return false;
  }
};

export const getWorkoutSessions = async () => {
  try {
    const sessions = await AsyncStorage.getItem(WORKOUT_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting workout sessions:', error);
    return [];
  }
};

export const getSessionsByDay = async () => {
  const sessions = await getWorkoutSessions();
  const days = Array(7).fill(0);
  
  sessions.forEach(session => {
    // Usamos dayOfWeek que guardamos previamente (0=Domingo, 6=Sábado)
    if (session.dayOfWeek !== undefined) {
      days[session.dayOfWeek]++;
    }
  });
  
  // Reordenamos para que la semana empiece en Lunes (1)
  return [...days.slice(1), days[0]];
};

export const getSessionsByMonth = async () => {
  const sessions = await getWorkoutSessions();
  const months = Array(12).fill(0);
  
  sessions.forEach(session => {
    if (session.month !== undefined) {
      months[session.month]++;
    }
  });
  
  return months;
};
