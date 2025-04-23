import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

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
      return '#ffc107'; // amarillo
    case ESTADOS_PEDIDO.ACEPTADO:
      return '#17a2b8'; // azul claro
    case ESTADOS_PEDIDO.PREPARANDO:
      return '#fd7e14'; // naranja
    case ESTADOS_PEDIDO.EN_CAMINO:
      return '#007bff'; // azul
    case ESTADOS_PEDIDO.ENTREGADO:
      return '#28a745'; // verde
    default:
      return '#6c757d'; // gris
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
        // Admin ve todos los pedidos
        q = query(pedidosRef, orderBy('fecha', 'desc'));
      } else {
        // Usuario normal solo ve sus pedidos
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

      const docRef = await addDoc(collection(db, 'pedidos'), nuevoPedido);
      await getPedidos(); // Actualizar lista de pedidos
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

      if (!user || !isAdmin) {
        throw new Error('No tienes permisos para actualizar pedidos');
      }

      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      });

      await getPedidos(); // Actualizar lista de pedidos
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      setError('Error al actualizar el estado del pedido');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getPedidos();
    } else {
      setPedidos([]);
    }
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