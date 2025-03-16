import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PatientPortalScreen from '../screens/PatientPortalScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Principal' }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

