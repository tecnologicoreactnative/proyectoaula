import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from '../screens/MenuScreen';

const Stack = createStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
    </Stack.Navigator>
  );
}

