import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Animated,
    TouchableWithoutFeedback
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeTwo = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [properties, setProperties] = useState([]);
    const menuAnim = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(menuAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(menuAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleLogout = () => navigation.navigate("Inicio");
    const handleReturn = () => navigation.navigate("Mis Publicaciones");
    const handleStatitic = () => navigation.navigate("Mis Estadisticas");
    const handleSchedule = () => navigation.navigate("Lista Citas");

    useFocusEffect(
        React.useCallback(() => {
            const loadProperties = async () => {
                try {
                    const storedData = await AsyncStorage.getItem("inmuebles");
                    if (storedData) setProperties(JSON.parse(storedData));
                } catch (error) {
                    console.log("Error cargando propiedades:", error);
                    Alert.alert("Error", "No se pudieron cargar las propiedades.");
                }
            };
            loadProperties();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🏡 Inmobiliaria Centenario</Text>
                <TouchableOpacity onPress={toggleMenu}>
                    <FontAwesome name="user-circle-o" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {menuVisible && (
    <TouchableWithoutFeedback onPress={toggleMenu}>
        <View style={styles.overlay}>
            <Animated.View
                style={[
                    styles.menu,
                    {
                        opacity: menuAnim,
                        transform: [
                            {
                                translateY: menuAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-20, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                    <MaterialIcons name="logout" size={22} color="#333" />
                    <Text style={styles.menuText}>Cerrar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReturn} style={styles.menuItem}>
                    <MaterialIcons name="business" size={22} color="#333" />
                    <Text style={styles.menuText}>Mis propiedades</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleStatitic} style={styles.menuItem}>
                    <MaterialIcons name="insert-chart" size={22} color="#333" />
                    <Text style={styles.menuText}>Mis Estadísticas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSchedule} style={styles.menuItem}>
                    <MaterialIcons name="schedule" size={22} color="#333" />
                    <Text style={styles.menuText}>Agenda</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    </TouchableWithoutFeedback>
)}


            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("Registrar Propiedad")}
            >
                <Text style={styles.addButtonText}>+ Publicar Propiedad</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.propertyGrid}>
                {properties.length > 0 ? (
                    properties.map((item, index) => (
                        <View key={index} style={styles.card}>
                            {item.imagenURI ? (
                                <Image
                                    source={{ uri: item.imagenURI }}
                                    style={styles.image}
                                    onError={() =>
                                        Alert.alert("Imagen no cargada", "No se puede mostrar la imagen.")
                                    }
                                />
                            ) : (
                                <Image
                                    source={require("../Constant/DataBase/Apartamento1.jpg")}
                                    style={styles.image}
                                />
                            )}
                            <View style={styles.info}>
                                <Text style={styles.propertyName}>{item.titulo}</Text>
                                <Text style={styles.propertyPrice}>
                                    ${item.precio?.toLocaleString()} COP
                                </Text>
                                <Text style={styles.propertyLocation}>{item.ciudad}</Text>

                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Ver Detalles</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.scheduleButton}
                                    onPress={() => navigation.navigate("Agendar", { property: item })}
                                >
                                    <Text style={styles.scheduleText}>Agendar</Text>
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
        backgroundColor: "#f0f4f7",
        paddingTop: 35,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4a90e2",
        paddingVertical: 15,
        paddingHorizontal: 30,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        fontStyle: "italic",
    },
    menu: {
        position: "absolute",
        top: 75,
        right: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
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
    addButton: {
        backgroundColor: "#4a90e2",
        padding: 12,
        margin: 15,
        borderRadius: 8,
        alignItems: "center",
        elevation: 3,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
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
        borderRadius: 12,
        marginBottom: 15,
        overflow: "hidden",
        elevation: 3,
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
        color: "#4a90e2",
        fontWeight: "bold",
        marginTop: 4,
    },
    propertyLocation: {
        fontSize: 12,
        color: "#888",
        marginVertical: 5,
    },
    button: {
        backgroundColor: "#4a90e2",
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
    scheduleButton: {
        backgroundColor: "#357ABD",
        padding: 10,
        borderRadius: 5,
        marginTop: 12,
    },
    scheduleText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    overlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0,3)",
        zIndex: 5,
    }
});

export default HomeTwo;

