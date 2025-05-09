import React, { createContext, useContext } from 'react';
import { useFoods } from '../hooks/useFoods';

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const foodsData = useFoods();

  return (
    <FoodContext.Provider value={foodsData}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFoodContext debe ser usado dentro de un FoodProvider');
  }
  return context;
};