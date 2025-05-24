import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa tu correo y contraseña");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Éxito", "Inicio de sesión exitoso");
            navigation.navigate("Perfil");
        } catch (error) {
            Alert.alert("Error", "Credenciales incorrectas o usuario no registrado");
        }
    };

    return (
        <View style={styles.container}>
            
            <LottieView
                source={require("../assets/Animation - 1745355344731.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
            />

            <Text style={styles.title}>Inmobiliaria Centenario</Text>

            <TextInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={secureText}
                right={
                    <TextInput.Icon
                        icon={secureText ? "eye-off" : "eye"}
                        onPress={() => setSecureText(!secureText)}
                    />
                }
                style={styles.input}
            />

            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Iniciar sesión
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4f7", // Igual que HomeTwo
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#4a90e2", // Azul del header de HomeTwo
        fontStyle: "italic",
    },
    input: {
        width: "100%",
        marginBottom: 15,
        backgroundColor: "white",
    },
    button: {
        width: "100%",
        padding: 5,
        backgroundColor: "#4a90e2", // Botón azul como HomeTwo
    },
    registerText: {
        marginTop: 20,
        color: "#4a90e2",
        fontSize: 16,
    },
});

export default Login;
