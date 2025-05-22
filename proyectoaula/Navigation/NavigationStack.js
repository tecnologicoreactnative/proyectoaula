import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import HomeTwo from '../Screens/HomeTwo';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import RegisterProperty from '../Screens/RegisterProperty';
import MyPublic from '../Screens/MyPublic';
import CrudProperty from '../Screens/CrudProperty';
import Statictics from '../Screens/Statictics';
import Schedule from '../Screens/Schedule';
import Appointments from '../Screens/Appointments';


const Stack = createStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator initialRouteName="Inicio">
            <Stack.Screen 
                name="Inicio" 
                component={Home} 
               // options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="Iniciar Sesion"
                component={Login} 
                //options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name= "Registro" 
                component={Register}
                //options={{headerShown: false}}
            />
            <Stack.Screen
                name="Perfil"
                component={HomeTwo}
                //options={{headerShown: false}}
            />
            <Stack.Screen name="Registrar Propiedad"
            component={RegisterProperty} 
            />
            <Stack.Screen name = "Mis Publicaciones"
            component={MyPublic}
            />
            <Stack.Screen
                name= "CrudProperty"
                component={CrudProperty}
            />
            <Stack.Screen
                name='Mis Estadisticas'
                component={Statictics}
            />
            <Stack.Screen
                name='Agendar'
                component={Schedule}
            />
            <Stack.Screen
                name='Lista Citas'
                component={Appointments}
            />
        </Stack.Navigator>
    );
};

export default NavigationStack;

/*Aqui manejamos la navegacion principal de las pantallas
donde tambien se maneja como pila*/