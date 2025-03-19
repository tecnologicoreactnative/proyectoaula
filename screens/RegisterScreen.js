import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedNombre = nombre.trim();
    const trimmedApellidos = apellidos.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword || !trimmedNombre || !trimmedApellidos) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const nombreCompleto = `${trimmedNombre} ${trimmedApellidos}`;
      await register(nombreCompleto, trimmedEmail, trimmedPassword);
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Registro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            autoCapitalize="words"
            editable={!isLoading}
          />

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

          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center"
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
  loginText: {
    marginTop: 20,
    color: "#007bff",
    fontSize: 16,
    textAlign: "center"
  },
  platoImagen: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
});

export default RegisterScreen;
