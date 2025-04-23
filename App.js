import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlatosProvider } from "./context/PlatosContext";
import { PedidosProvider } from "./context/PedidosContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MenuScreen from "./screens/MenuScreen";
import AdminScreen from "./screens/AdminScreen";
import EditPlatoScreen from "./screens/EditPlatoScreen";
import PedidosScreen from "./screens/PedidosScreen";
import AdminPedidosScreen from "./screens/AdminPedidosScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007bff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
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
            options={{ 
              title: "Registro",
              headerBackTitle: "Atrás"
            }}
          />
        </>
      ) : (
        <>
          {isAdmin ? (
            <>
              <Stack.Screen 
                name="Admin" 
                component={AdminScreen}
                options={{ 
                  title: "Panel de Administración",
                  headerLeft: null
                }}
              />
              <Stack.Screen 
                name="EditPlatoScreen" 
                component={EditPlatoScreen}
                options={({ route }) => ({
                  title: route.params?.plato ? 'Editar Plato' : 'Nuevo Plato'
                })}
              />
              <Stack.Screen 
                name="AdminPedidos" 
                component={AdminPedidosScreen}
                options={{ 
                  title: "Gestión de Pedidos"
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Menu" 
                component={MenuScreen}
                options={{ 
                  title: "Menú",
                  headerLeft: null
                }}
              />
              <Stack.Screen 
                name="Pedidos" 
                component={PedidosScreen}
                options={{ 
                  title: "Mis Pedidos"
                }}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlatosProvider>
          <PedidosProvider>
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </PedidosProvider>
        </PlatosProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
