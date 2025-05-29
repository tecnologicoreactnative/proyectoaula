import React from "react";
import { AuthProvider } from "../context/AutenticacionContext";
import PortalNavigation from "./PortalNavigation";
import { NavigationContainer } from "@react-navigation/native";

import { View, Text } from "react-native";

const Invocacion = () => {
  return <PortalNavigation />;
};

const InvocationNavigation = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Invocacion />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default InvocationNavigation;
//** */
