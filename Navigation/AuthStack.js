import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Login';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{
                headerShown: false
            }} />
        </Stack.Navigator>
    );
};
export default AuthStack;
/*Aqui se configura la navegacion en pila, teneniedo como 
pantalla de incio el home*/