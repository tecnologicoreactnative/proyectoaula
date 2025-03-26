import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import HomeTwo from '../Screens/HomeTwo';
import Login from '../Screens/Login';
import Register from '../Screens/Register';


const Stack = createStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
                name="Home" 
                component={Home} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="Login" 
                component={Login} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name= "Registro" 
                component={Register}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="HomeTwo"
                component={HomeTwo}
                options={{headerShown: false}}
            /> 
        </Stack.Navigator>
    );
};

export default NavigationStack;

/*Aqui manejamos la navegacion principal de las pantallas
donde tambien se maneja como pila*/