import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientPortalScreen from '../screens/PatientPortalScreen';

const Stack = createNativeStackNavigator();

const PortalNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PatientPortal">
        <Stack.Screen name="PatientPortal" component={PatientPortalScreen}  options={{ title: 'Portal' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PortalNavigation;

