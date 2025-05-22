import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const CrudProperty = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { property } = route.params; // Recibe la propiedad a editar

    const [titulo, setTitulo] = useState(property.titulo);
    const [precio, setPrecio] = useState(property.precio.toString());
    const [ciudad, setCiudad] = useState(property.ciudad);
    const [imagenURI, setImagenURI] = useState(property.imagenURI);

    const handleSaveChanges = async () => {
        try {
            const storedData = await AsyncStorage.getItem('inmuebles');
            let properties = storedData ? JSON.parse(storedData) : [];

            // Buscar y reemplazar la propiedad existente por ID
            const updatedProperties = properties.map(p => {
                if (p.id === property.id) {
                    return {
                        ...p,
                        titulo,
                        precio: parseFloat(precio),
                        ciudad,
                        imagenURI
                    };
                }
                return p;
            });

            await AsyncStorage.setItem('inmuebles', JSON.stringify(updatedProperties));
            Alert.alert("Éxito", "Propiedad actualizada correctamente");
            navigation.goBack(); // Volver a HomeTwo
        } catch (error) {
            console.log("Error al guardar cambios:", error);
            Alert.alert("Error", "No se pudo guardar la propiedad");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Propiedad</Text>

            <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Título"
            />
            <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="Precio"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                value={ciudad}
                onChangeText={setCiudad}
                placeholder="Ciudad"
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#6200ee",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CrudProperty;
