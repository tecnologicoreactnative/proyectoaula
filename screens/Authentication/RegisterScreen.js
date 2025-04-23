import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform, 
  ActivityIndicator
} from "react-native";
import AppLogoImage from "../../components/Logo/AppLogoImage";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../firebaseConfig";
import Brand from "../../components/Logo/Brand";
import { useUsersContext } from "../../context/UsersContext";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { addUser } = useUsersContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleRegister = async () => {
    const formattedname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    if (!email || !password || !formattedname || !formattedLastName || !age || !gender) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "El correo debe ser válido");
      return;
    }

    if (isNaN(age)) {
      Alert.alert("Error", "La edad debe ser un número");
      return;
    }

    try {
      setIsLoading(true);
      

      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formattedname} ${formattedLastName}`,
      });

      await addUser(formattedname, email, password, formattedLastName, age, gender);

      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("LoginScreen");
    } catch (error) {
      let errorMessage = "Ocurrió un error al registrar el usuario";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo ya está registrado";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico no válido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Error de conexión. Verifica tu internet";
      }
      
      Alert.alert("Error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#000' }} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: "15%", flex: 1, backgroundColor: '#000' }}>
          {!isKeyboardVisible && (
            <View style={styles.headerContainer}>
              <AppLogoImage />
              <Brand />
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              onChangeText={(text) => setEmail(text.trim())}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Ingresa tu email"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              secureTextEntry
              onChangeText={(text) => setPassword(text.trim())}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              onChangeText={(text) => setName(text.trim())}
              style={styles.input}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Apellido:</Text>
            <TextInput
              onChangeText={(text) => setLastName(text.trim())}
              style={styles.input}
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Edad:</Text>
            <TextInput
              onChangeText={(text) => setAge(text.trim())}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ingresa tu edad"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Género:</Text>
            <TextInput
              onChangeText={(text) => setGender(text.trim())}
              style={styles.input}
              placeholder="Ingresa tu género"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity 
              onPress={handleRegister}
              style={[styles.registerButton, { backgroundColor: 'blue' }]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={redirectLogin} style={styles.loginLink}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    color: 'white',
    backgroundColor: '#222',
  },
  registerButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0000ff",
    borderColor: "#0000ff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#4a9ff5',
    textAlign: 'center',
  },
});
