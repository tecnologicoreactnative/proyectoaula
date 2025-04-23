import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientPortalScreen from '../screens/PatientPortalScreen';
import EspecialistPortal from '../screens/EspecialistPortal';
import Agendamiento from '../screens/Agendamiento';
import AdminScreen from '../screens/AdminScreen';
const Stack = createNativeStackNavigator();

const PortalNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="PatientPortal" component={PatientPortalScreen}  options={{ title: 'Paciente' }}/>
        <Stack.Screen name="Agendamiento" component={Agendamiento} options={{ title: 'Agendamiento' }}/>
        <Stack.Screen name="EspecialistPortal" component={EspecialistPortal}  options={{ title: 'Portal' }}/>
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PortalNavigation;

