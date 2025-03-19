import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../context/AuthContext";

const MenuScreen = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const platosColombinos = [
    {
      id: 1,
      nombre: "Bandeja Paisa",
      descripcion: "Plato tradicional que incluye frijoles, arroz, chicharrón, carne molida, huevo frito, plátano maduro, aguacate y arepa.",
      precio: "$25.000",
      imagen: require('../assets/platos/bandejapaisa.jpg')
    },
    {
      id: 2,
      nombre: "Ajiaco Santafereño",
      descripcion: "Sopa cremosa con tres tipos de papas, pollo, mazorca, crema y alcaparras, servida con arroz blanco.",
      precio: "$22.000",
      imagen: require('../assets/platos/ajiaco-santafereño.jpg')
    },
    {
      id: 3,
      nombre: "Sancocho de Gallina",
      descripcion: "Sopa sustanciosa con gallina criolla, yuca, plátano, papa y verduras, acompañada de arroz y aguacate.",
      precio: "$24.000",
      imagen: require('../assets/platos/sancochogallina.jpg')
    },
    {
      id: 4,
      nombre: "Lechona Tolimense",
      descripcion: "Cerdo relleno de arroz, arvejas y especias, cocido lentamente hasta quedar crujiente.",
      precio: "$28.000",
      imagen: require('../assets/platos/lechona.jpg')
    },
    {
      id: 5,
      nombre: "Cazuela de Mariscos",
      descripcion: "Deliciosa combinación de mariscos en salsa cremosa de coco, servida con arroz y patacones.",
      precio: "$32.000",
      imagen: require('../assets/platos/cazuela-mariscos.jpg')
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platos Típicos Colombianos</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {platosColombinos.map((plato) => (
          <View key={plato.id} style={styles.platoCard}>
            <View style={styles.platoImageContainer}>
              <Image
                source={plato.imagen}
                style={styles.platoImagen}
                resizeMode="cover"
              />
            </View>
            <View style={styles.platoInfo}>
              <Text style={styles.platoNombre}>{plato.nombre}</Text>
              <Text style={styles.platoDescripcion}>{plato.descripcion}</Text>
              <Text style={styles.platoPrecio}>{plato.precio}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center"
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 16
  },
  platoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden"
  },
  platoImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  platoImagen: {
    width: "100%",
    height: 200,
  },
  platoInfo: {
    padding: 16
  },
  platoNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8
  },
  platoDescripcion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20
  },
  platoPrecio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff"
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default MenuScreen;