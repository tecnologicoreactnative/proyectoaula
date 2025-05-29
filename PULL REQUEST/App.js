import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import InvocationNavigation from './src/navigation/Invocation';

const App = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta a notificación:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <InvocationNavigation />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>¡Listo para recibir notificaciones!</Text>
      </View>
    </View>
  );
};

export default App;
//** */
