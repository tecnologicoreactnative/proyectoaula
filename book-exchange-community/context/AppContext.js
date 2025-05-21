import React, { createContext, useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [widthApp, setWidthApp] = useState(useWindowDimensions().width);
  const [heightApp, setHeightApp] = useState(useWindowDimensions().height);

  // Para manejar detalles de usuario y tema:
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    photoUrl: "",
  });

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        widthApp,
        heightApp,
        userDetails,
        setUserDetails,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
