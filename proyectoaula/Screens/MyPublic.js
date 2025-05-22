/*import React, { useState } from "react";
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
                        setProperties(updatedProperties); // Actualiza el estado local

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
      {/* Encabezado */ /*
      <View style={styles.header}>
        <Text style={styles.title}>Mis Propiedades Publicadas</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialIcons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */ /*
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.menuItem}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
            <Text style={styles.menuText}>Volver</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de propiedades */ /*
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
                    style={[styles.button, { marginTop: 5 }]}
                    onPress={() => navigation.navigate("CrudProperty", { property: item })}
                    >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "red", marginTop: 5 }]}
                    onPress={() => handleDeleteProperty(item.id)}
                    >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No hay propiedades registradas
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  menu: {
    position: "absolute",
    top: 75,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  propertyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    width: "45%",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: 120,
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
    fontWeight: "bold",
    color: "#6200ee",
    marginTop: 5,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MyPublic;
*/
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
