import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function registerForPushNotificationsAsync() { 
try { 
const { status: existingStatus } = await 
Notifications.getPermissionsAsync(); 
let finalStatus = existingStatus; 
if (existingStatus !== 'granted') { 
const { status } = await Notifications.requestPermissionsAsync(); 
finalStatus = status; 
} 
if (finalStatus !== 'granted') { 
Alert.alert('Error', 'No se pudieron obtener los permisos para recibir notificaciones.'); 
return; 
} 
const tokenData = await Notifications.getExpoPushTokenAsync(); 
const token = tokenData.data; 
console.log('Token Expo:', token); 
await saveTokenToFirebase(token);
return token; 
} catch (error) { 
console.error('Error registrando notificaciones:', error); 
} 
} 
Notifications.setNotificationHandler({ 
handleNotification: async () => ({ 
shouldShowAlert: true, 
shouldPlaySound: false, 
shouldSetBadge: false, 
}), 
}); 
export async function sendPushNotification(expoPushToken) { 
const message = { 
to: expoPushToken, 
sound: 'default', 
title: '¡Hola!  ', 
body: 'Esta es una notificación push de prueba.', 
data: { info: 'Algunos datos adicionales' }, 
}; 
await fetch('https://exp.host/--/api/v2/push/send', { 
method: 'POST', 
headers: { 
Accept: 'application/json', 
'Content-Type': 'application/json' 
}, 
body: JSON.stringify(message), 
}); 
}
export async function saveTokenToFirebase(token) {
  try {
    await setDoc(doc(db, 'expoPushTokens', token), {
      token,
      updatedAt: serverTimestamp(),
    });
    console.log('Token guardado en Firebase');
  } catch (error) {
    console.error('Error al guardar el token en Firebase:', error);
    Alert.alert('Error', 'No se pudo guardar el token en Firebase.');
  }
}

