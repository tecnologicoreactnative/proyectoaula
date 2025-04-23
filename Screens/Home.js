import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const properties = [
    {
        id: "1",
        title: "Apartamento en Medellín",
        price: "$500,000,000 COP",
        location: "Castilla, Medellín",
        image: require("../Constant/DataBase/Apartamento1.jpg"),
        description: "Hermoso apartamento con vista panorámica y amplias zonas comunes.",
    },
    {
        id: "2",
        title: "Casa en Envigado",
        price: "$850,000,000 COP",
        location: "Envigado, Antioquia",
        image: require("../Constant/DataBase/Apartamento2.jpg"),
        description: "Casa moderna con 3 habitaciones, 2 baños y jardín privado.",
    },
    {
        id: "3",
        title: "Finca en Rionegro",
        price: "$1,500,000,000 COP",
        location: "Rionegro, Antioquia",
        image: require("../Constant/DataBase/Apartamento3.jpg"),
        description: "Espectacular finca con piscina y zonas verdes.",
    },
];

const Home = () => {
    const [expandedId, setExpandedId] = useState(null);
    const navigation = useNavigation();

    const toggleDescription = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;
        return (
            <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                    <Text style={styles.location}>{item.location}</Text>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => toggleDescription(item.id)}
                    >
                        <Text style={styles.detailsText}>
                            {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                        </Text>
                    </TouchableOpacity>
                    {isExpanded && (
                        <Animated.View style={styles.descriptionContainer}>
                            <Text style={styles.description}>{item.description}</Text>
                        </Animated.View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Encabezado con espacio en la parte superior */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Propiedades Disponibles</Text>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.loginText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de propiedades */}
            <FlatList
                data={properties}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 15,
        paddingTop: 50, // Agrega espacio en la parte superior
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        paddingHorizontal: 10, // Evita que el contenido toque los bordes laterales
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    loginButton: {
        backgroundColor: "#6200ee",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        elevation: 3,
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        width: "100%",
        height: 180,
    },
    cardContent: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6200ee",
        marginTop: 5,
    },
    location: {
        fontSize: 14,
        color: "#666",
        marginVertical: 5,
    },
    detailsButton: {
        marginTop: 10,
        backgroundColor: "#6200ee",
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: "center",
    },
    detailsText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    descriptionContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
    description: {
        fontSize: 14,
        color: "#333",
    },
});

export default Home;