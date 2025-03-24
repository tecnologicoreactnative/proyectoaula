import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
  
    try {
      await login(trimmedEmail, trimmedPassword);
    } catch (error) {
      console.error("Error en el login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("RegisterScreen")}
        disabled={isLoading}
      >
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    backgroundColor: "#fff"
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#333"
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9"
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 20,
    color: "#007bff",
    fontSize: 16,
  },
});

export default LoginScreen;
