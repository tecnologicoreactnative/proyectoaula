import React, { createContext, useState, useContext } from 'react';
import { useUsers } from '../hooks/useUsers';

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const user = useUsers();

  return (
    <UsersContext.Provider value={user}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers debe ser usado dentro de un UsersProvider');
  }
  return context;
}
