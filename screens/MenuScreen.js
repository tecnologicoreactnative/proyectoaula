import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { usePlatos } from '../context/PlatosContext';
import { usePedidos } from '../context/PedidosContext';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const { platos, loading, error, getPlatos } = usePlatos();
  const { crearPedido } = usePedidos();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatos, setSelectedPlatos] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    getPlatos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getPlatos();
    setRefreshing(false);
  };

  const handleIncrement = (platoId) => {
    setSelectedPlatos(prev => ({
      ...prev,
      [platoId]: (prev[platoId] || 0) + 1
    }));
  };

  const handleDecrement = (platoId) => {
    setSelectedPlatos(prev => ({
      ...prev,
      [platoId]: Math.max((prev[platoId] || 0) - 1, 0)
    }));
  };

  const handlePedir = async () => {
    const platosSeleccionados = Object.entries(selectedPlatos)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([platoId, cantidad]) => {
        const plato = platos.find(p => p.id === platoId);
        return {
          id: platoId,
          nombre: plato.nombre,
          precio: parseFloat(plato.precio) * 1000,
          cantidad
        };
      });

    if (platosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un plato');
      return;
    }

    try {
      await crearPedido(platosSeleccionados);
      Alert.alert('Éxito', 'Tu pedido ha sido creado correctamente');
      setSelectedPlatos({});
      navigation.navigate('Pedidos');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el pedido. Inténtalo de nuevo.');
    }
  };

  const formatPrice = (price) => {
    const number = parseFloat(price) * 1000;
    return number.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace('COP', '$');
  };

  const renderPlatoItem = ({ item }) => {
    const cantidad = selectedPlatos[item.id] || 0;

    return (
      <View style={styles.platoCard}>
        <Image
          source={{ uri: item.imagen }}
          style={styles.platoImage}
          resizeMode="cover"
        />
        <View style={styles.platoInfo}>
          <Text style={styles.platoName}>{item.nombre || 'Sin nombre'}</Text>
          <Text style={styles.platoDescription} numberOfLines={2}>
            {item.descripcion || 'Sin descripción'}
          </Text>
          <Text style={styles.platoPrice}>{formatPrice(item.precio)}</Text>
          <View style={styles.cantidadContainer}>
            <TouchableOpacity 
              style={styles.cantidadButton}
              onPress={() => handleDecrement(item.id)}
            >
              <Ionicons name="remove" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.cantidadText}>{cantidad}</Text>
            <TouchableOpacity 
              style={styles.cantidadButton}
              onPress={() => handleIncrement(item.id)}
            >
              <Ionicons name="add" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
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
        <TouchableOpacity style={styles.retryButton} onPress={getPlatos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasSelectedPlatos = Object.values(selectedPlatos).some(cantidad => cantidad > 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={platos}
        renderItem={renderPlatoItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.platosList}
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
            <Text style={styles.emptyText}>
              No hay platos disponibles
            </Text>
          </View>
        }
      />
      <View style={styles.actionButtonsContainer}>
        {hasSelectedPlatos && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.pedirButton]}
            onPress={handlePedir}
          >
            <Ionicons name="cart" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Pedidos')}
        >
          <Ionicons name="receipt-outline" size={30} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={logout}
        >
          <Ionicons name="log-out" size={30} color="#dc3545" />
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  platosList: {
    padding: 15,
  },
  platoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  platoImage: {
    width: '100%',
    height: 200,
  },
  platoInfo: {
    padding: 20,
  },
  platoName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  platoDescription: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 22,
  },
  platoPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007bff',
    marginBottom: 12,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
  },
  cantidadButton: {
    padding: 8,
  },
  cantidadText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    color: '#212529',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  pedirButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  }
});

export default MenuScreen;