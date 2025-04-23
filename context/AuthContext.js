import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebaseConfig"; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8 && /\d/.test(password);
  };

  // iniciar sesión con Firebase
  const login = async (email, password) => {
    if (!isValidEmail(email)) {
      alert("Correo inválido. Usa un formato válido como correo@gmail.com");
      return;
    }

    if (!isValidPassword(password)) {
      alert("La contraseña debe tener al menos 8 caracteres y un número.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // Verificar si es admin
      if (email.toLowerCase() === "adminrestaurante@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("Este correo no está registrado.");
      } else if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta.");
      } else {
        alert("Error al iniciar sesión. Inténtalo de nuevo.");
      }
      throw error;
    }
  };

  // registrar usuario en Firebase
  const register = async (name, email, password) => {
    if (!isValidEmail(email)) {
      alert("Correo inválido. Usa un formato válido como correo@gmail.com");
      return;
    }

    if (!isValidPassword(password)) {
      alert("La contraseña debe tener al menos 8 caracteres y un número.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { 
        displayName: name 
      });
      setUser(userCredential.user);
      setIsAdmin(false);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("El correo ingresado no es válido.");
      } else {
        alert("Error en el registro. Inténtalo de nuevo.");
      }
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      alert("Error al cerrar sesión. Inténtalo de nuevo.");
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email.toLowerCase() === "adminrestaurante@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};