import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientPortalScreen from '../screens/PatientPortalScreen';
<<<<<<< HEAD
import EspecialistPortal from '../screens/EspecialistPortal';
import Agendamiento from '../screens/Agendamiento';
import AdminScreen from '../screens/AdminScreen';
=======

>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
const Stack = createNativeStackNavigator();

const PortalNavigation = () => {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator >
        <Stack.Screen name="PatientPortal" component={PatientPortalScreen}  options={{ title: 'Paciente' }}/>
        <Stack.Screen name="Agendamiento" component={Agendamiento} options={{ title: 'Agendamiento' }}/>
        <Stack.Screen name="EspecialistPortal" component={EspecialistPortal}  options={{ title: 'Portal' }}/>
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }}/>
        
=======
      <Stack.Navigator initialRouteName="PatientPortal">
        <Stack.Screen name="PatientPortal" component={PatientPortalScreen}  options={{ title: 'Portal' }}/>
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PortalNavigation;

