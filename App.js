import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import InvocationNavigation from './src/navigation/Invocation';

export default function App() {
 
const notificationListener = useRef(); 
const responseListener = useRef(); 
useEffect(() => { 
// Registrar dispositivo para recibir notificaciones y guardar token en Firebase 
registerForPushNotificationsAsync(); 
// Listener para recibir notificaciones en primer plano 
notificationListener.current = Notifications.addNotificationReceivedListener(notification => { 
console.log('Notificación recibida:', notification); 
}); 
// Listener para respuestas a notificaciones (cuando el usuario interactúa) 
responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { 
console.log('Respuesta a notificación:', response); 
}); 
return () => { 
Notifications.removeNotificationSubscription(notificationListener.current
 ); 
Notifications.removeNotificationSubscription(responseListener.current); 
}; 
}, []); 

 return <InvocationNavigation />;

} 


