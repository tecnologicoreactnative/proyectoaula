import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { usePedidos, ESTADOS_PEDIDO, getEstadoTexto, getEstadoColor } from '../context/PedidosContext';
import { Ionicons } from '@expo/vector-icons';

const AdminPedidosScreen = () => {
  const { pedidos, loading, error, getPedidos, actualizarEstadoPedido } = usePedidos();
  const [refreshing, setRefreshing] = useState(false);

  const formatPrice = (price) => {
    const number = parseFloat(price);
    return number.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace('COP', '$');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getPedidos();
    setRefreshing(false);
  };

  const getSiguienteEstado = (estadoActual) => {
    switch (estadoActual) {
      case ESTADOS_PEDIDO.PENDIENTE:
        return ESTADOS_PEDIDO.ACEPTADO;
      case ESTADOS_PEDIDO.ACEPTADO:
        return ESTADOS_PEDIDO.PREPARANDO;
      case ESTADOS_PEDIDO.PREPARANDO:
        return ESTADOS_PEDIDO.EN_CAMINO;
      case ESTADOS_PEDIDO.EN_CAMINO:
        return ESTADOS_PEDIDO.ENTREGADO;
      default:
        return null;
    }
  };

  const getBotonTexto = (estadoActual) => {
    switch (estadoActual) {
      case ESTADOS_PEDIDO.PENDIENTE:
        return 'Aceptar Pedido';
      case ESTADOS_PEDIDO.ACEPTADO:
        return 'Comenzar Preparación';
      case ESTADOS_PEDIDO.PREPARANDO:
        return 'Enviar Pedido';
      case ESTADOS_PEDIDO.EN_CAMINO:
        return 'Marcar como Entregado';
      default:
        return '';
    }
  };

  const handleActualizarEstado = async (pedidoId, estadoActual) => {
    const siguienteEstado = getSiguienteEstado(estadoActual);
    if (!siguienteEstado) return;

    try {
      await actualizarEstadoPedido(pedidoId, siguienteEstado);
      Alert.alert('Éxito', 'Estado del pedido actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido');
    }
  };

  const renderPedidoItem = ({ item }) => {
    const fecha = new Date(item.fecha.seconds * 1000);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const siguienteEstado = getSiguienteEstado(item.estado);
    const total = parseFloat(item.total);

    return (
      <View style={styles.pedidoCard}>
        <View style={styles.pedidoHeader}>
          <View>
            <Text style={styles.pedidoFecha}>{fechaFormateada}</Text>
            <Text style={styles.usuarioNombre}>{item.usuarioNombre}</Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estadoTexto}>{getEstadoTexto(item.estado)}</Text>
          </View>
        </View>

        <View style={styles.platosContainer}>
          {item.platos.map((plato, index) => {
            const subtotal = parseFloat(plato.precio) * plato.cantidad;
            return (
              <View key={index} style={styles.platoItem}>
                <View style={styles.platoInfoContainer}>
                  <Text style={styles.platoNombre}>{plato.nombre}</Text>
                  <Text style={styles.platoDetalle}>
                    {formatPrice(plato.precio)} x {plato.cantidad}
                  </Text>
                </View>
                <Text style={styles.platoPrecio}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.pedidoFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total del pedido:</Text>
            <Text style={styles.totalText}>{formatPrice(total)}</Text>
          </View>
          {siguienteEstado && (
            <TouchableOpacity
              style={[styles.actualizarButton, { backgroundColor: getEstadoColor(siguienteEstado) }]}
              onPress={() => handleActualizarEstado(item.id, item.estado)}
            >
              <Text style={styles.actualizarButtonText}>
                {getBotonTexto(item.estado)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getPedidos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        renderItem={renderPedidoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.pedidosList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007bff"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#6c757d" />
            <Text style={styles.emptyText}>No hay pedidos pendientes</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  pedidosList: {
    padding: 16,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pedidoFecha: {
    fontSize: 14,
    color: '#6c757d',
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginTop: 4,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  platosContainer: {
    marginBottom: 12,
  },
  platoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  platoInfoContainer: {
    flex: 1,
  },
  platoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  platoDetalle: {
    fontSize: 14,
    color: '#6c757d',
  },
  platoPrecio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginLeft: 16,
  },
  pedidoFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
  },
  actualizarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  actualizarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default AdminPedidosScreen; 