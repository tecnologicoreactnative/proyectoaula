import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebaseConfig"; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { registerForPushNotificationsAsync, setupNotificationListeners } from '../utils/notifications';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email.toLowerCase() === "adminrestaurante@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // Registrar para notificaciones
        const token = await registerForPushNotificationsAsync(currentUser.uid);
        if (token) {
          console.log('Token de notificaciones registrado:', token);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribeNotifications;
    
    if (user) {
      unsubscribeNotifications = setupNotificationListeners((notification) => {
        // Aquí puedes manejar las notificaciones recibidas
        console.log('Notificación recibida:', notification);
      });
    }

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [user]);

  const updateUserPushToken = async (userId, token) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        expoPushToken: token,
        lastTokenUpdate: new Date()
      }, { merge: true });
      console.log('Token guardado exitosamente para usuario:', userId);
    } catch (error) {
      console.error('Error al actualizar token:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      if (userCredential.user.email.toLowerCase() === "adminrestaurante@gmail.com") {
        setIsAdmin(true);
      }
      return userCredential.user;
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Correo o contraseña incorrectos.");
      } else {
        alert("Error al iniciar sesión. Inténtalo de nuevo.");
      }
      throw error;
    }
  };

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
      
      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date(),
        role: 'client'
      });
      
      return userCredential.user;
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

  const value = {
    user,
    loading,
    isAdmin,
    isValidEmail,
    isValidPassword,
    login,
    register,
    logout,
    updateUserPushToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};