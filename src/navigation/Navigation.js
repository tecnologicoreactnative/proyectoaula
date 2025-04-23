import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PatientPortalScreen from '../screens/PatientPortalScreen';
import Agendamiento from '../screens/Agendamiento';
import Inicio from '../screens/Inicio';
import Citas from '../screens/Citas';
import EspecialistPortal from '../screens/EspecialistPortal';
import Cancelacion_Reprogramacion from '../screens/Cancelacion_Reprogramacion';
import AdminScreen from '../screens/AdminScreen';


const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Principal' }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }}/>
        <Stack.Screen name="PatientPortal" component={PatientPortalScreen}  options={{ title: 'Portal' }}/>
        <Stack.Screen name="Agendamiento" component={Agendamiento} options={{ title: 'Agendamiento' }}/>
        <Stack.Screen name="Inicio" component={Inicio} options={{ title: 'Inicio' }}/>
        <Stack.Screen name="Citas" component={Citas} options={{ title: 'Citas' }}/>
        <Stack.Screen name="EspecialistPortal" component={EspecialistPortal} options={{ title: 'Portal' }}/>
        <Stack.Screen name="Cancelacion_Reprogramacion" component={Cancelacion_Reprogramacion} options={{ title: 'Cancelación/Reprogramación' }}/>
       <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }}/>
        
        
        
        {/* Agrega más pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

