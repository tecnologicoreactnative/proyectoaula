import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

import HomeScreen from "../screens/Home/HomeScreen";
import WorkoutScreen from "../screens/Workout/WorkoutScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const auth = getAuth(app);

function TabNavigator() {
  const user = auth.currentUser;

  return (
    <Tab.Navigator
      style={{
        position: "absolute",
        bottom: 0,
        height: "100%",
      }}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarActiveTintColor: "#3385ff",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" color={color} size={size} />
          ),
        }}
      />
      {user && !user.isAnonymous ? (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" color={"#fff"} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default TabNavigator;
