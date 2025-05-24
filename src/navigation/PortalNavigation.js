import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientPortalScreen from "../screens/PatientPortalScreen";
import EspecialistPortal from "../screens/EspecialistPortal";
import Agendamiento from "../screens/Agendamiento";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AdminScreen from "../screens/AdminScreen";
import Citas from "../screens/Citas";
import HistoryScreen from "../screens/HistoryScreen";
import WebScreen from "../screens/WebScreen";

const Stack = createNativeStackNavigator();

const PortalNavigation = () => {
  return (
    <Stack.Navigator>
      {/* public */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Principal" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Registro" }}
      />
      {/* private */}
      <Stack.Screen
        name="PatientPortal"
        component={PatientPortalScreen}
        options={{ title: "Paciente" }}
      />
      <Stack.Screen
        name="Agendamiento"
        component={Agendamiento}
        options={{ title: "Agendamiento" }}
      />
      <Stack.Screen
        name="EspecialistPortal"
        component={EspecialistPortal}
        options={{ title: "Portal" }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: "Admin" }}
      />
      <Stack.Screen
        name="Citas"
        component={Citas}
        options={{ title: "Citas" }}
      />
      <Stack.Screen
        name="historial"
        component={HistoryScreen}
        options={{ title: "Historial" }}
        />
        <Stack.Screen
        name="WebScreen"
        component={WebScreen}
        options={{ title: "Web" }}
        />
      
    </Stack.Navigator>
  );
};

export default PortalNavigation;
//** */
