import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Button, Modal, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
  barPercentage: 0.5,
};

const properties = [
  {
    id: "1",
    name: "Apartamento en Medellín",
    price: "$500,000,000 COP",
    location: "Castilla, Medellín",
    image: require("../Constant/DataBase/Apartamento1.jpg"),
  },
  {
    id: "2",
    name: "Casa en Envigado",
    price: "$850,000,000 COP",
    location: "Envigado, Antioquia",
    image: require("../Constant/DataBase/Apartamento2.jpg"),
  },
  {
    id: "3",
    name: "Finca en Rionegro",
    price: "$1,500,000,000 COP",
    location: "Rionegro, Antioquia",
    image: require("../Constant/DataBase/Apartamento3.jpg"),
  },
];

const HomeTwo = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [newProperty, setNewProperty] = useState({
    name: "",
    price: "",
    location: "",
    image: null,
  });

  const handleLogout = () => {
    navigation.navigate("Home");
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setNewProperty({ ...newProperty, image: result.assets[0].uri });
      }
    } else {
      alert("Se requiere permiso para acceder a las imágenes.");
    }
  };

  const handleAddProperty = () => {
    const { name, price, location, image } = newProperty;

    if (name && price && location && image) {
      properties.push({
        id: (properties.length + 1).toString(),
        name,
        price,
        location,
        image: { uri: image },
      });

      setClickCount(clickCount + 1); // Incrementa contador

      setShowForm(false);
      setNewProperty({ name: "", price: "", location: "", image: null });

      Alert.alert("Propiedad Agregada", "¡Se agregó exitosamente!");
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido Inmobiliaria Centenario</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialIcons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <MaterialIcons name="logout" size={24} color="#333" />
            <Text style={styles.menuText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de propiedades */}
      <ScrollView contentContainerStyle={styles.propertyGrid}>
        {properties.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.propertyName}>{item.name}</Text>
              <Text style={styles.propertyPrice}>{item.price}</Text>
              <Text style={styles.propertyLocation}>{item.location}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón agregar */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>Agregar Propiedad</Text>
      </TouchableOpacity>

      {/* Botón estadísticas */}
      <TouchableOpacity style={styles.statsButton} onPress={() => setShowStats(true)}>
        <Text style={styles.addButtonText}>Ver Estadísticas</Text>
      </TouchableOpacity>

      {/* Formulario */}
      <Modal visible={showForm} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={newProperty.name}
              onChangeText={(text) => setNewProperty({ ...newProperty, name: text })}
            />
            <TextInput
              placeholder="Precio"
              style={styles.input}
              value={newProperty.price}
              onChangeText={(text) => setNewProperty({ ...newProperty, price: text })}
            />
            <TextInput
              placeholder="Ubicación"
              style={styles.input}
              value={newProperty.location}
              onChangeText={(text) => setNewProperty({ ...newProperty, location: text })}
            />
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerText}>
                {newProperty.image ? "Imagen seleccionada" : "Seleccionar imagen"}
              </Text>
            </TouchableOpacity>
            {newProperty.image && (
              <Image source={{ uri: newProperty.image }} style={{ width: "100%", height: 100, marginTop: 10 }} />
            )}
            <Button title="Agregar Propiedad" onPress={handleAddProperty} />
            <Button title="Cancelar" onPress={() => setShowForm(false)} color="red" />
          </View>
        </View>
      </Modal>

      {/* Modal Estadísticas */}
      <Modal visible={showStats} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.formContainer, { alignItems: "center" }]}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Estadísticas de Clics</Text>
            <BarChart
              data={{
                labels: ["Agregar Propiedad"],
                datasets: [{ data: [clickCount] }],
              }}
              width={screenWidth * 0.7}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
            />
            <Button title="Cerrar" onPress={() => setShowStats(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f0f0f0",
    },
    header: {
      backgroundColor: "#6200ee",
      padding: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    menu: {
      backgroundColor: "#fff",
      padding: 10,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    menuText: {
      marginLeft: 10,
      fontSize: 16,
    },
    propertyGrid: {
      padding: 10,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 15,
      overflow: "hidden",
      elevation: 3,
    },
    image: {
      width: "100%",
      height: 150,
    },
    info: {
      padding: 10,
    },
    propertyName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    propertyPrice: {
      color: "#6200ee",
      marginVertical: 5,
    },
    propertyLocation: {
      color: "#666",
    },
    button: {
      backgroundColor: "#6200ee",
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    addButton: {
      backgroundColor: "#6200ee",
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 10,
    },
    addButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      backgroundColor: "#fff",
      padding: 20,
      width: "90%",
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    imagePickerButton: {
      backgroundColor: "#eee",
      padding: 10,
      alignItems: "center",
      borderRadius: 5,
    },
    imagePickerText: {
      color: "#333",
    },
    statsButton: {
      backgroundColor: "#6200ee",
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      marginBottom: 10,
      marginHorizontal: 10,
    },
  });
  

export default HomeTwo;
