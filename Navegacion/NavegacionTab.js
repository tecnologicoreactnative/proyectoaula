import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InicioScreen from '../pantallas/InicioScreen';
import ConfigScreen from '../pantallas/ConfigScreen';
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
const NavegacionTabs = () => {
 return (
 <Tab.Navigator initialRouteName="Inicio" screenOptions={({ route })=> ({
 tabBarIcon: ({ color, size }) => {
 let icono;
 if (route.name === 'Inicio') {
 icono = 'home';
 } else if (route.name === 'Configuracion') {
 icono = 'settings';
 }
 return <Ionicons name={icono} size={size} color={color} />;
 },
 })}>
 <Tab.Screen name="Inicio" component={InicioScreen} options={{
title: 'Inicio ' }} />
 <Tab.Screen name="Configuracion" component={ConfigScreen}
options={{ title: 'Configuración ' }} />
 </Tab.Navigator>
 );
};
export default NavegacionTabs;