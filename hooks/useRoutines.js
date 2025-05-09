import { useFirestore } from "./useFirestore";
import { useState } from "react";

export const useRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const {
    loading,
    error,
    addData,
    getData,
    updateData,
    deleteData,
    getAllData,
  } = useFirestore();
  const loadAllRoutines = async () => {
    const result = await getAllData("routines");
    setRoutines(result);
    return result;
  };

  const getRoutine = async (routineId) => {
    const result = await getData(routineId);
    setCurrentRoutine(result);
    return result;
  };

  const addRoutine = async (routineData) => {
    return await addData("routines", {
      ...routineData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateRoutine = async (routineId, updatedData) => {
    return await updateData(routineId, {
      ...updatedData,
      lastUpdated: new Date().toISOString(),
    });
  };

  const deleteRoutine = async (routineId) => {
    return await deleteData("routines", routineId);
  };

  return {
    routines,
    currentRoutine,
    loading,
    error,
    addRoutine,
    getRoutine,
    updateRoutine,
    deleteRoutine,
    loadAllRoutines,
  };
};