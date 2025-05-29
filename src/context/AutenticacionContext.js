import React, { createContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada');
    } catch (error) {
      console.error('No se pudo cerrar sesión', error);
    }
  };

  const authContextValue = useMemo(() => ({
    user,
    signIn,
    logOut,
  }), [user]);

  if (initializing) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
