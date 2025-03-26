import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons"; // Importamos el ícono de flecha

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
            navigation.navigate("HomeTwo"); // Redirige a HomeTwo.js
        } catch (error) {
            Alert.alert("Error", "Credenciales incorrectas o usuario no registrado");
        }
    };

    return (
        <View style={styles.container}>
            {/* se implementa el boton de regresar al home*/}
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="black" />
            </TouchableOpacity>

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
        backgroundColor: "#f5f5f5",
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
        color: "#333",
    },
    input: {
        width: "100%",
        marginBottom: 15,
    },
    button: {
        width: "100%",
        padding: 5,
        backgroundColor: "#6200ee",
    },
    registerText: {
        marginTop: 20,
        color: "#6200ee",
        fontSize: 16,
    },
});

export default Login;