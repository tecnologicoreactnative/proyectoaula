import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import jwt from 'jsonwebtoken';

// Función para obtener un token de acceso
async function getAccessToken() {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: createJWT(),
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    throw error;
  }
}

// Función para crear el JWT
function createJWT() {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;
  const expTime = now + oneHour;

  const payload = {
    iss: process.env.FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expTime,
    iat: now,
  };

  try {
    return jwt.sign(payload, process.env.FIREBASE_PRIVATE_KEY, { algorithm: 'RS256' });
  } catch (error) {
    console.error('Error al crear JWT:', error);
    throw error;
  }
}

// Solicitar permisos de notificaciones
export async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }
  
  return true; // En Android, los permisos se manejan en el manifest
}

// Obtener el token de FCM
export async function getFCMToken() {
  try {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('Error al obtener token FCM:', error);
    return null;
  }
}

// Guardar el token en Firestore
export async function saveFCMToken(userId, token) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      fcmToken: token,
      lastTokenUpdate: new Date()
    });
    console.log('Token FCM guardado en Firestore');
  } catch (error) {
    console.error('Error al guardar token FCM:', error);
  }
}

// Configurar listeners de notificaciones
export function setupFCMListeners(onMessageReceived) {
  // Manejar notificaciones cuando la app está en segundo plano
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Mensaje recibido en segundo plano:', remoteMessage);
    return onMessageReceived(remoteMessage);
  });

  // Manejar notificaciones cuando la app está en primer plano
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Mensaje recibido en primer plano:', remoteMessage);
    return onMessageReceived(remoteMessage);
  });

  return unsubscribe;
}

// Enviar notificación FCM
export async function sendFCMNotification(token, title, body, data = {}) {
  try {
    console.log('Iniciando envío de notificación FCM');
    console.log('Token destino:', token);
    console.log('Título:', title);
    console.log('Cuerpo:', body);
    console.log('Datos adicionales:', data);

    const accessToken = await getAccessToken();

    const projectId = process.env.PROJECT_ID;
    if (!projectId) {
      throw new Error('PROJECT_ID no está configurado en las variables de entorno');
    }

    const message = {
      message: {
        token: token,
        notification: {
          title,
          body,
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'HIGH',
            channel_id: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              content_available: true
            }
          }
        },
        data
      }
    };

    console.log('Mensaje completo a enviar:', JSON.stringify(message, null, 2));

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta de FCM:', response.status, errorText);
      throw new Error(`Error en la respuesta de FCM: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Respuesta de FCM:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('Error al enviar notificación FCM:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
} 