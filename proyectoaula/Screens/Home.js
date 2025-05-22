/*import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const navigation = useNavigation();
    const [expandedId, setExpandedId] = useState(null);
    const [properties, setProperties] = useState([]);

    const fetchProperties = async () => {
        try {
            const storedData = await AsyncStorage.getItem("inmuebles");
            const properties = storedData ? JSON.parse(storedData) : [];
            setProperties(properties);
        } catch (error) {
            console.error("Error al cargar propiedades desde AsyncStorage:", error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const toggleDescription = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={styles.card}>
                <Image source={{ uri: item.imagenURI }} style={styles.image} />
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.titulo}</Text>
                    <Text style={styles.price}>${item.precio}</Text>
                    <Text style={styles.location}>{item.ciudad}</Text>
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
                            <Text style={styles.description}>{item.descripcion}</Text>
                            <TouchableOpacity
                                style={styles.reserveButton}
                                onPress={() => navigation.navigate("Iniciar Sesion")}
                            >
                                <Text style={styles.reserveButtonText}>¡Reserva Ahora!</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    list: {
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
        height: 200,
    },
    cardContent: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        color: "green",
    },
    location: {
        fontSize: 14,
        color: "#666",
    },
    detailsButton: {
        marginTop: 10,
    },
    detailsText: {
        color: "#007bff",
        fontWeight: "bold",
    },
    descriptionContainer: {
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        color: "#333",
    },
    reserveButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
    },
    reserveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Home;*/
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Asegúrate de tener este paquete instalado

const Home = () => {
    const navigation = useNavigation();
    const [expandedId, setExpandedId] = useState(null);
    const [properties, setProperties] = useState([]);

    const fetchProperties = async () => {
        try {
            const storedData = await AsyncStorage.getItem("inmuebles");
            const properties = storedData ? JSON.parse(storedData) : [];
            setProperties(properties);
        } catch (error) {
            console.error("Error al cargar propiedades desde AsyncStorage:", error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const toggleDescription = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={styles.card}>
                <Image
                    source={{ uri: item.imagenURI }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{item.titulo}</Text>
                    <Text style={styles.price}>${item.precio}</Text>
                    <Text style={styles.location}>{item.ciudad}</Text>

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
                            <Text style={styles.description}>{item.descripcion}</Text>
                            <TouchableOpacity
                                style={styles.reserveButton}
                                onPress={() => navigation.navigate("Iniciar Sesion")}
                            >
                                <Text style={styles.reserveButtonText}>¡Reserva Ahora!</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Inmobiliaria Centenario</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Iniciar Sesion")}>
                    <Icon name="person-circle-outline" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={properties}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f2f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    list: {
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: "100%",
        height: 200,
    },
    cardContent: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        color: "#27ae60",
        marginBottom: 5,
    },
    location: {
        fontSize: 15,
        color: "#777",
        marginBottom: 10,
    },
    detailsButton: {
        backgroundColor: "#5dade2",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 5,
    },
    detailsText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    descriptionContainer: {
        marginTop: 10,
    },
    description: {
        fontSize: 15,
        color: "#444",
        lineHeight: 22,
    },
    reserveButton: {
        backgroundColor: "#58d68d",
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: "center",
    },
    reserveButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
});

export default Home;
