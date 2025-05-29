import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const getUserData = async (userId) => {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No se encontró el usuario en la colección 'User'.");
      return null;
    } else {
      const userData = querySnapshot.docs[0].data();
      console.log("Usuario encontrado:", userData);
      return userData;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      const user = response.user;

      if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          setUser(userData);
          return userData;
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuario no encontrado");
      } else {
        alert("Error al iniciar sesión");
      }
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("No se pudo cerrar sesión", error);
    }
  };

  const authContextValue = {
    user,
    signIn,
    logOut,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) return;

      getUserData(authUser.uid)
        .then((userData) => {
          if (userData) {
            setUser(userData);

            if (userData.role === "admin") navigation.navigate("Admin");
            else if (userData.role === "paciente")
              navigation.navigate("PatientPortal");
            else if (userData.role === "especialista")
              navigation.navigate("EspecialistPortal");
            else {
              console.error("Rol no reconocido");
            }
          } else {
            setUser(null);
          }
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
//** */
