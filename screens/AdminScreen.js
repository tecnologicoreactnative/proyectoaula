import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { usePlatos } from "../context/PlatosContext";
import { Ionicons } from '@expo/vector-icons';

const AdminScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { platos, loading, error, deletePlato } = usePlatos();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatPrice = (price) => {
    const number = parseFloat(price) * 1000;
    return number.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace('COP', '$');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  };

  const handleDeletePlato = async (id) => {
    Alert.alert(
      "Eliminar Plato",
      "¿Estás seguro de que quieres eliminar este plato?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deletePlato(id);
              Alert.alert("Éxito", "Plato eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el plato. Inténtalo de nuevo.");
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleUpdatePlato = (plato) => {
    navigation.navigate("EditPlatoScreen", { plato });
  };

  const handleAddPlato = () => {
    navigation.navigate("EditPlatoScreen");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => getPlatos()}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer}>
            {platos.map((plato) => (
              <View key={plato.id} style={styles.platoCard}>
                <Image
                  source={{ uri: plato.imagen }}
                  style={styles.platoImagen}
                  resizeMode="cover"
                />
                <View style={styles.platoInfo}>
                  <Text style={styles.platoNombre}>{plato.nombre}</Text>
                  <Text style={styles.platoDescripcion}>{plato.descripcion}</Text>
                  <Text style={styles.platoPrecio}>{formatPrice(plato.precio)}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.button, styles.updateButton]}
                      onPress={() => handleUpdatePlato(plato)}
                      disabled={isDeleting}
                    >
                      <Text style={styles.buttonText}>Actualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => handleDeletePlato(plato.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={styles.buttonText}>Eliminar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AdminPedidos')}
            >
              <Ionicons name="receipt-outline" size={30} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddPlato}
            >
              <Ionicons name="add" size={30} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={30} color="#dc3545" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa"
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center"
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  platoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e9ecef"
  },
  platoImagen: {
    width: "100%",
    height: 200,
  },
  platoInfo: {
    padding: 20
  },
  platoNombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 8
  },
  platoDescripcion: {
    fontSize: 15,
    color: "#6c757d",
    marginBottom: 12,
    lineHeight: 22
  },
  platoPrecio: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007bff",
    marginBottom: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  updateButton: {
    backgroundColor: "#28a745",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'column',
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
});

export default AdminScreen; 