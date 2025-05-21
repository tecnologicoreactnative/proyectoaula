import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, Alert } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlatosProvider } from "./context/PlatosContext";
import { PedidosProvider } from "./context/PedidosContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './utils/notifications';

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MenuScreen from "./screens/MenuScreen";
import AdminScreen from "./screens/AdminScreen";
import EditPlatoScreen from "./screens/EditPlatoScreen";
import PedidosScreen from "./screens/PedidosScreen";
import AdminPedidosScreen from "./screens/AdminPedidosScreen";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, loading, isAdmin, updateUserPushToken } = useAuth();

  useEffect(() => {
    let cleanupNotifications;

    const setupNotifications = async () => {
      if (user) {
        console.log('Iniciando configuración de notificaciones para:', user.uid);

        try {
          // Configurar notificaciones
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });

          // Registrar para notificaciones
          const token = await registerForPushNotificationsAsync(user.uid);
          console.log('Token obtenido:', token);
          
          if (token) {
            await updateUserPushToken(user.uid, token);
            console.log('Token actualizado en Firestore');
          }

          // Configurar listeners de notificaciones
          cleanupNotifications = setupNotificationListeners(notification => {
            console.log('Notificación recibida en App.js:', notification);
            Alert.alert(
              notification.request.content.title,
              notification.request.content.body
            );
          });
        } catch (error) {
          console.error('Error al configurar notificaciones:', error);
        }
      }
    };

    setupNotifications();

    return () => {
      if (cleanupNotifications) {
        cleanupNotifications();
      }
    };
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          {isAdmin ? (
            <>
              <Stack.Screen 
                name="Admin" 
                component={AdminScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="EditPlato" 
                component={EditPlatoScreen}
                options={{ 
                  title: "Editar Plato",
                  headerStyle: {
                    backgroundColor: '#f8f9fa',
                  },
                  headerTintColor: '#212529',
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                }}
              />
              <Stack.Screen 
                name="AdminPedidos" 
                component={AdminPedidosScreen}
                options={{ 
                  title: "Gestionar Pedidos",
                  headerStyle: {
                    backgroundColor: '#f8f9fa',
                  },
                  headerTintColor: '#212529',
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Menu" 
                component={MenuScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Pedidos" 
                component={PedidosScreen}
                options={{ 
                  title: "Mis Pedidos",
                  headerStyle: {
                    backgroundColor: '#f8f9fa',
                  },
                  headerTintColor: '#212529',
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                }}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <PlatosProvider>
            <PedidosProvider>
              <Navigation />
            </PedidosProvider>
          </PlatosProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
