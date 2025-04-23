import { createContext, useContext, useState } from 'react';
import { useRoutines } from '../hooks/useRoutines';

const RoutinesContext = createContext();

export const RoutinesProvider = ({ children }) => {
  const routines = useRoutines();

  return (
    <RoutinesContext.Provider value={routines}>
      {children}
    </RoutinesContext.Provider>
  );
};

export const useRoutinesContext = () => {
  const context = useContext(RoutinesContext);
  if (!context) {
    throw new Error('useRoutinesContext debe usarse dentro de un RoutinesProvider');
  }
  return context;
};