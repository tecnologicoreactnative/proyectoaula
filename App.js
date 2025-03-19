import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MenuScreen from "./screens/MenuScreen";

const Stack = createStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen 
            name="RegisterScreen" 
            component={RegisterScreen}
            options={{ 
              headerShown: true,
              headerBackTitle: "",
              title: "Registro"
            }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="MenuScreen" 
          component={MenuScreen}
          options={{ 
            headerShown: true,
            title: "Menú",
            headerLeft: null 
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
