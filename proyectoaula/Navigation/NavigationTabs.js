import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import Detailscreen from '../Screens/Detailscreen';
//import ConfigScreen from '../pantallas/ConfigScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const NavigationTabs = () => {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={({ route })=> ({
                tabBarIcon: ({ color, size }) => {
                    let icono;
                    if (route.name === 'Home') {
                        icono = 'home';
                    } else if (route.name === 'Detalles') {
                        icono = 'settings';
                    }
                    return <Ionicons name={icono} size={size} color={color} />;
                },
            })}>
            <Tab.Screen name="Home" component={Home} options={{
                title: 'Home '
            }} />
            <Tab.Screen name="Detalles" component={Detailscreen}
                options={{ title: 'Detalles ' }} />
        </Tab.Navigator>
    );
};
export default NavigationTabs;
/* Parte de la navegacion de la aplicacion para volver de una pantalla
a la anterior*/