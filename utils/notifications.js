import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función de prueba para enviar una notificación local
export async function sendTestNotification() {
  try {
    const notificationContent = {
      content: {
        title: '¡Prueba de Notificación!',
        body: 'Esta es una notificación de prueba',
        data: { type: 'test' },
      },
      trigger: null, // null significa que se enviará inmediatamente
    };

    console.log('Enviando notificación de prueba...');
    const notificationId = await Notifications.scheduleNotificationAsync(notificationContent);
    console.log('Notificación enviada con ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error al enviar notificación de prueba:', error);
    throw error;
  }
}

export async function registerForPushNotificationsAsync(userId) {
  let token;

  // Verificar autenticación
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('Usuario no autenticado');
    return null;
  }

  console.log('Usuario autenticado:', {
    uid: currentUser.uid,
    email: currentUser.email,
    isAnonymous: currentUser.isAnonymous
  });

  if (!Device.isDevice) {
    console.log('Las notificaciones push requieren un dispositivo físico');
    return null;
  }

  // Configurar canal de notificaciones para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Solicitar permisos
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('No se obtuvieron permisos para las notificaciones');
    return null;
  }

  console.log('Permisos de notificaciones concedidos');

  // Obtener token
  try {
    console.log('Obteniendo token de Expo...');
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.PROJECT_ID,
    });
    token = tokenData.data;
    console.log('Token obtenido:', token);

    // Guardar token en Firestore
    if (currentUser.uid && token) {
      try {
        console.log('Intentando guardar token en Firestore...');
        // Usar el ID del usuario autenticado
        const tokenRef = doc(db, 'pushTokens', currentUser.uid);
        
        const tokenData = {
          expoPushToken: token,
          lastTokenUpdate: new Date(),
          devicePlatform: Platform.OS,
          userId: currentUser.uid,
          email: currentUser.email || null,
          isAnonymous: currentUser.isAnonymous
        };

        console.log('Guardando datos:', tokenData);
        
        // Intentar guardar directamente
        await setDoc(tokenRef, tokenData);
        
        // Verificar que se guardó correctamente
        const verifyDoc = await getDoc(tokenRef);
        if (verifyDoc.exists()) {
          console.log('Token guardado exitosamente en Firestore');
          console.log('Datos guardados:', verifyDoc.data());
        } else {
          console.error('Error: El documento no se guardó correctamente');
        }
      } catch (firestoreError) {
        console.error('Error al guardar token en Firestore:', firestoreError);
        console.error('Detalles del error:', {
          code: firestoreError.code,
          message: firestoreError.message,
          stack: firestoreError.stack
        });
        throw firestoreError;
      }
    } else {
      console.error('No se pudo guardar el token: usuario o token inválido', {
        hasUserId: !!currentUser.uid,
        hasToken: !!token
      });
    }

    return token;
  } catch (error) {
    console.error('Error al obtener/guardar token:', error);
    console.error('Detalles del error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return null;
  }
}

export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  try {
    // Si estamos en desarrollo o en emulador, enviar notificación local
    if (__DEV__ || !Device.isDevice) {
      console.log('Enviando notificación local en modo desarrollo');
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null,
      });
    }

    if (!expoPushToken) {
      console.error('Token de notificación no válido');
      throw new Error('Token de notificación no válido');
    }

    console.log('Preparando notificación push para:', expoPushToken);
    
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
    };

    console.log('Enviando notificación push:', message);

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en la respuesta del servidor:', errorData);
      throw new Error(`Error del servidor: ${errorData.message || 'Error desconocido'}`);
    }

    const responseData = await response.json();
    console.log('Respuesta del servidor de notificaciones:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    // En desarrollo, intentar enviar notificación local como fallback
    if (__DEV__) {
      try {
        console.log('Intentando enviar notificación local como fallback');
        return await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: 'default',
          },
          trigger: null,
        });
      } catch (localError) {
        console.error('Error al enviar notificación local:', localError);
      }
    }
    throw error;
  }
}

export function setupNotificationListeners(onNotificationReceived) {
  const notificationListener = Notifications.addNotificationReceivedListener(
    notification => {
      console.log('Notificación recibida:', notification);
      onNotificationReceived(notification);
    }
  );

  const responseListener = Notifications.addNotificationResponseReceivedListener(
    response => {
      console.log('Respuesta a notificación recibida:', response);
      onNotificationReceived(response.notification);
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
} 