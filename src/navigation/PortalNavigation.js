// PortalNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import PatientPortalScreen from '../screens/PatientPortalScreen';
import AnotherScreen      from '../screens/AnotherScreen';
import AgendarScreen from '../screens/AgendarScreen';
import ListarCitasScreen from '../screens/ListarCitasScreen';

const Tab = createBottomTabNavigator();

const PortalNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="PatientPortal"
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#006699',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="PatientPortal"
        component={PatientPortalScreen}
        options={{
          tabBarLabel: 'Mi portal',
          headerTitle:  'Mi portal',         
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Solicitudes"
        component={AgendarScreen}
        options={{
          tabBarLabel: 'Solicita tu cita',
          headerTitle:  'Solicita tu cita',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Citas"
        component={ListarCitasScreen}
        options={{
          tabBarLabel: 'Mis citas',
          headerTitle:  'Mis citas',          // ← aquí también
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      

      <Tab.Screen
        name="WhatsApp"
        component={AnotherScreen}
        options={{
          tabBarLabel: 'WhatsApp',
          headerTitle:  'WhatsApp',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            Linking.openURL('https://wa.me/3195187895');
          },
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default PortalNavigation;
