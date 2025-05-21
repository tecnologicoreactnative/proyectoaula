import * as Notifications from 'expo-notifications'; 
import { Platform, Alert } from 'react-native'; 
import { db } from './firebaseConfig';


export async function saveTokenToFirebase(token) { 
try { 
// Guarda el token en la colección 'expoPushTokens' 
await db.collection('expoPushTokens').doc(token).set({ token, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), }); 
console.log('Token guardado en Firebase'); 
} catch (error) { 
console.error('Error al guardar el token en Firebase:', error); 
} 
} 
// Ésta Función es para registrar el dispositivo y obtener el token push de Expo (Para identificar el dispostivio. 
export async function registerForPushNotificationsAsync() { 
try { 
// Obtener el estado actual de los permisos 
const { status: existingStatus } = await 
Notifications.getPermissionsAsync(); 
let finalStatus = existingStatus; 
// Si los permisos no están concedidos, solicitarlos 
if (existingStatus !== 'granted') { 
const { status } = await Notifications.requestPermissionsAsync(); 
finalStatus = status; 
} 
if (finalStatus !== 'granted') { 
Alert.alert('Error', 'No se pudieron obtener los permisos para recibir notificaciones.'); 
return; 
} 
// Obtener el token de notificaciones de Expo 
const tokenData = await Notifications.getExpoPushTokenAsync(); 
const token = tokenData.data; 
console.log('Token Expo:', token); 
// Aquí puedes llamar a la función para guardar el token en Firebase 
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
