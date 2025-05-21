import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { sendPushNotification } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

const PedidosContext = createContext();

export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  ACEPTADO: 'aceptado',
  PREPARANDO: 'preparando',
  EN_CAMINO: 'en_camino',
  ENTREGADO: 'entregado'
};

export const getEstadoTexto = (estado) => {
  switch (estado) {
    case ESTADOS_PEDIDO.PENDIENTE:
      return 'Pendiente de aceptación';
    case ESTADOS_PEDIDO.ACEPTADO:
      return 'Aceptado por la tienda';
    case ESTADOS_PEDIDO.PREPARANDO:
      return 'Preparando tu comida';
    case ESTADOS_PEDIDO.EN_CAMINO:
      return 'En camino';
    case ESTADOS_PEDIDO.ENTREGADO:
      return 'Entregado';
    default:
      return estado;
  }
};

export const getEstadoColor = (estado) => {
  switch (estado) {
    case ESTADOS_PEDIDO.PENDIENTE:
      return '#ffc107';
    case ESTADOS_PEDIDO.ACEPTADO:
      return '#17a2b8';
    case ESTADOS_PEDIDO.PREPARANDO:
      return '#fd7e14';
    case ESTADOS_PEDIDO.EN_CAMINO:
      return '#007bff';
    case ESTADOS_PEDIDO.ENTREGADO:
      return '#28a745';
    default:
      return '#6c757d';
  }
};

const obtenerMensajeEstado = (estado) => {
  switch (estado) {
    case ESTADOS_PEDIDO.ACEPTADO:
      return '¡Tu pedido ha sido aceptado! Pronto comenzaremos a prepararlo.';
    case ESTADOS_PEDIDO.PREPARANDO:
      return '¡Tu pedido está siendo preparado! No tardaremos mucho.';
    case ESTADOS_PEDIDO.EN_CAMINO:
      return '¡Tu pedido está en camino! Pronto llegará a tu ubicación.';
    case ESTADOS_PEDIDO.ENTREGADO:
      return '¡Tu pedido ha sido entregado! ¡Que lo disfrutes!';
    default:
      return 'El estado de tu pedido ha sido actualizado.';
  }
};

export const usePedidos = () => useContext(PedidosContext);

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const isAdmin = user?.email === "adminrestaurante@gmail.com";

  const getPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setPedidos([]);
        return;
      }

      const pedidosRef = collection(db, 'pedidos');
      let q;
      
      if (isAdmin) {
        q = query(pedidosRef, orderBy('fecha', 'desc'));
      } else {
        q = query(
          pedidosRef,
          where('usuarioId', '==', user.uid),
          orderBy('fecha', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const pedidosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const crearPedido = async (platos) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      console.log('Creando nuevo pedido para usuario:', user.uid);

      const total = platos.reduce((sum, plato) => {
        const subtotal = parseFloat(plato.precio) * plato.cantidad;
        return sum + subtotal;
      }, 0);

      const nuevoPedido = {
        usuarioId: user.uid,
        usuarioNombre: user.displayName || 'Usuario',
        platos,
        estado: ESTADOS_PEDIDO.PENDIENTE,
        fecha: new Date(),
        total: total.toString()
      };

      console.log('Datos del nuevo pedido:', nuevoPedido);

      const docRef = await addDoc(collection(db, 'pedidos'), nuevoPedido);
      console.log('Pedido creado con ID:', docRef.id);

      try {
        if (__DEV__) {
          console.log('Enviando notificación local en modo desarrollo');
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Nuevo pedido recibido!',
              body: `${user.displayName || 'Un usuario'} ha realizado un nuevo pedido.`,
              data: { 
                type: 'NEW_ORDER',
                pedidoId: docRef.id 
              },
              sound: 'default',
            },
            trigger: null,
          });
          console.log('Notificación local enviada exitosamente');
        } else {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', 'adminrestaurante@gmail.com'));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data();
            console.log('Admin encontrado con ID:', adminDoc.id);
            
            if (adminData.expoPushToken) {
              console.log('Intentando enviar notificación al admin con token:', adminData.expoPushToken);
              await sendPushNotification(
                adminData.expoPushToken,
                '¡Nuevo pedido recibido!',
                `${user.displayName || 'Un usuario'} ha realizado un nuevo pedido.`,
                { 
                  type: 'NEW_ORDER',
                  pedidoId: docRef.id 
                }
              );
              console.log('Notificación enviada al admin exitosamente');
            } else {
              console.log('No se pudo enviar notificación al admin: token no encontrado');
            }
          } else {
            console.log('No se encontró el usuario admin');
          }
        }
      } catch (notifError) {
        console.error('Error al enviar notificación:', notifError);
      }

      await getPedidos();
      return docRef.id;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      setError('Error al crear el pedido');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      setLoading(true);
      setError(null);

      const pedidoRef = doc(db, 'pedidos', pedidoId);
      const pedidoDoc = await getDoc(pedidoRef);

      if (!pedidoDoc.exists()) {
        throw new Error('Pedido no encontrado');
      }

      const pedidoData = pedidoDoc.data();
      await updateDoc(pedidoRef, { 
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      });

      try {
        const userRef = doc(db, 'users', pedidoData.usuarioId);
        const userDoc = await getDoc(userRef);
        console.log('Datos del usuario:', userDoc.exists() ? 'encontrado' : 'no encontrado');
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.expoPushToken) {
            console.log('Intentando enviar notificación al usuario con token:', userData.expoPushToken);
            const mensaje = obtenerMensajeEstado(nuevoEstado);
            await sendPushNotification(
              userData.expoPushToken,
              '¡Tu pedido ha sido actualizado!',
              mensaje,
              { 
                type: 'ORDER_STATUS_UPDATE',
                pedidoId,
                estado: nuevoEstado 
              }
            );
            console.log('Notificación enviada al usuario exitosamente');
          } else {
            console.log('No se pudo enviar notificación: usuario sin token');
          }
        } else {
          console.log('No se pudo enviar notificación: usuario no encontrado');
        }
      } catch (notifError) {
        console.error('Error al enviar notificación:', notifError);
      }

      await getPedidos();
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      setError('Error al actualizar el estado del pedido');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPedidos();
  }, [user?.uid]);

  const value = {
    pedidos,
    loading,
    error,
    getPedidos,
    crearPedido,
    actualizarEstadoPedido,
    isAdmin
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
}; 