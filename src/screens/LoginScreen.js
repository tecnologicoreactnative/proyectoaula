import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AutenticacionContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const user = await signIn(email, password);

      if (!user) {
        console.error("Error de inicio de sesión: usuario no encontrado");
        return;
      }

      if (user.role === "admin") navigation.navigate("Admin");
      else if (user.role === "paciente") navigation.navigate("PatientPortal");
      else if (user.role === "especialista")
        navigation.navigate("EspecialistPortal");
      else {
        console.error("Rol no reconocido");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#274b6a"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#274b6a"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.loginText}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  loginText: {
    color: "#274b6a",
    fontWeight: "bold",
  },
  video: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderColor: "transparent",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#274b6a",
  },
  button: {
    backgroundColor: "#274b6a",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
});

export default LoginScreen;
//** *///** */
