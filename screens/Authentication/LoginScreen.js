import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { app } from "../../firebaseConfig";
import AppLogoImage from "../../components/Logo/AppLogoImage";
import AppLogoImage2 from "../../components/Logo/AppLogoImage2";
import Ready from "../../components/Logo/Ready";
import { Ionicons } from "@expo/vector-icons";
import Brand from "../../components/Logo/Brand";
import BrandText from "../../components/Logo/BrandText";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const setEmailTrim = (text) => {
    setEmail(text.trim());
  };
  const setPasswordTrim = (text) => {
    setPassword(text.trim());
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const redirectRegister = () => {
    navigation.navigate("RegisterScreen");
  };
  const handleGuestLogin = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Sesion iniciada como invitado");
        navigation.navigate("TabHome");
        navigation.reset({
          index: 0,
          routes: [{ name: "TabHome" }],
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        console.log("Sesion iniciada:", uid);
        navigation.navigate("TabHome");
        navigation.reset({
          index: 0,
          routes: [{ name: "TabHome" }],
        });
      })
      .catch((error) => {
        console.log("Error:", error.message);
        const errorMessage =
          error.code === "auth/email-already-in-use"
            ? "Este correo ya está registrado"
            : error.code === "auth/invalid-email"
            ? "Correo electrónico no válido"
            : error.code === "auth/missing-password"
            ? "Debe ingresar una contraseña"
            : error.code === "auth/invalid-credential"
            ? "Correo y/o contraseña incorrectos"
            : error.code === "auth/network-request-failed"
            ? "Error de conexión. Verifica tu internet"
            : "Ocurrió un error al registrar";
  
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      /* behavior={Platform.OS === "ios" ? "padding" : "height"} */
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingTop: "15%" }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <AppLogoImage />
            <Brand />
          </View>

          {!isKeyboardVisible && (
            <View style={styles.headerContainer}>
              <Ready />
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              onChangeText={setEmailTrim}
              style={styles.input}
              autoCapitalize="none"
              placeholder="Introduce tu email"
              placeholderTextColor={"white"}
            />
            <Text style={styles.label}>Contraseña:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  secureTextEntry={!mostrarContrasena}
                  onChangeText={setPasswordTrim}
                  style={[styles.input, { flex: 1 }]}
                  autoCapitalize="none"
                  placeholder="Introduce tu contraseña"
                  placeholderTextColor={"white"}
                />
              </View>
              <View style={{ marginLeft: 10, flexDirection: "column" }}>
                <Ionicons
                  name={mostrarContrasena ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="gray"
                  style={{ marginLeft: 10, marginTop: -5 }}
                  onPress={() => setMostrarContrasena(!mostrarContrasena)}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSignIn} style={styles.loginButton}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity /* onPress={""} */>
              <Text style={styles.forgottenText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
          {!isKeyboardVisible && (
            <View>
              <TouchableOpacity
                onPress={handleGuestLogin}
                style={styles.invitadoButton}
              >
                <Text style={{ color: "red" }}>Acceder como invitado</Text>
              </TouchableOpacity>
            <View>
            </View>
              <TouchableOpacity
                onPress={() => {
                  const auth = getAuth(app);
                  signInWithEmailAndPassword(auth, "admin2@ad.ad", "admin3")
                    .then((userCredential) => {
                      const user = userCredential.user;
                      console.log("Sesión iniciada como admin");
                      navigation.navigate("TabHome");
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "TabHome" }],
                      });
                    })
                    .catch((error) => {
                      console.log("Error al iniciar sesión como admin:", error.message);
                    });
                }}
                style={styles.invitadoButton}
              >
                <Text style={{ color: "yellow" }}>Acceder como Admin</Text>
              </TouchableOpacity>
            </View>
          )}


          {!isKeyboardVisible /*redirectRegister */ && (
            <View
              style={{ width: "80%", alignSelf: "center", marginTop: "15%" }}
            >
              <TouchableOpacity
                onPress={redirectRegister}
                style={styles.redirectRegister}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Regístrate con nosotros
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <AppLogoImage2 />
                <BrandText />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
    marginBottom: "10%",
    paddingRight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    marginRight: 10,
    color: "white",
  },
  text: {
    fontSize: 30,
    fontWeight: "500",
    color: "black",
    marginTop: 20,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  redirectRegister: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  forgottenText: {
    textAlign: "center",
    color: "blue",
    marginTop: 15,
  },
  sideText: {
    fontSize: 15,
    color: "red",
    fontWeight: "500",
    alignSelf: "center",
  },
  loginButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0000ff",
    borderColor: "#0000ff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  invitadoButton: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
    color: "white",
  },
});
