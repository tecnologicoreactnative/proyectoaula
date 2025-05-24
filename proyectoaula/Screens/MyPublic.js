import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MyPublic = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [properties, setProperties] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadProperties = async () => {
        try {
          const storedData = await AsyncStorage.getItem('inmuebles');
          if (storedData) {
            setProperties(JSON.parse(storedData));
          }
        } catch (error) {
          console.log('Error cargando propiedades:', error);
          Alert.alert('Error', 'No se pudieron cargar las propiedades.');
        }
      };

      loadProperties();
    }, [])
  );

  const handleDeleteProperty = async (id) => {
    Alert.alert(
      "Eliminar Propiedad",
      "¿Estás seguro de que deseas eliminar esta propiedad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const storedData = await AsyncStorage.getItem("inmuebles");
              let properties = storedData ? JSON.parse(storedData) : [];

              const updatedProperties = properties.filter(item => item.id !== id);
              await AsyncStorage.setItem("inmuebles", JSON.stringify(updatedProperties));
              setProperties(updatedProperties);

              Alert.alert("Éxito", "Propiedad eliminada correctamente");
            } catch (error) {
              console.error("Error al eliminar propiedad:", error);
              Alert.alert("Error", "No se pudo eliminar la propiedad.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Publicadas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.propertyGrid}>
        {properties.length > 0 ? (
          properties.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.imagenURI ? (
                <Image source={{ uri: item.imagenURI }} style={styles.image} />
              ) : (
                <Image
                  source={require("../Constant/DataBase/Apartamento1.jpg")}
                  style={styles.image}
                />
              )}
              <View style={styles.info}>
                <Text style={styles.propertyName}>{item.titulo}</Text>
                <Text style={styles.propertyPrice}>${item.precio.toLocaleString()} COP</Text>
                <Text style={styles.propertyLocation}>{item.ciudad}</Text>

                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Ver Detalles</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#92B4EC" }]}
                  onPress={() => navigation.navigate("CrudProperty", { property: item })}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#FF6B6B" }]}
                  onPress={() => handleDeleteProperty(item.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noProperties}>No hay propiedades registradas</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    paddingTop: 20,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center"
  },
  propertyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: 10,
  },
  card: {
    width: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#888",
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  noProperties: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});

export default MyPublic;
