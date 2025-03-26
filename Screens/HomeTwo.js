import React, { useState } from "react";
import { 
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

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

    const handleLogout = () => {
        // agregar la logica para cerrar sesion desde firebase
        navigation.navigate("Home");
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido Inmobiliaria Centenario</Text>
                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                    <MaterialIcons name="settings" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Menú desplegable */}
            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                        <MaterialIcons name="logout" size={24} color="#333" />
                        <Text style={styles.menuText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Lista de Propiedades */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 35, // Espacio para que el encabezado no esté pegado arriba
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#6200ee",
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 5, // Sombra en Android
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    menu: {
        position: "absolute",
        top: 75, // Se coloca debajo del header
        right: 20,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        zIndex: 10, // Asegura que esté sobre las imágenes
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

export default HomeTwo;
