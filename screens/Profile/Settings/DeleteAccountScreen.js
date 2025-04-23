import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUsersContext } from "../../../context/UsersContext";

const DeleteAccountScreen = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { updateUser } = useUsersContext();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleDeleteAccount = async () => {
    if (!user?.email) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Contraseña inválida.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      const success = await updateUser(user.email, {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });

      if (!success) {
        throw new Error("No se pudo marcar como eliminado en la base de datos.");
      }

      await deleteUser(user);

      Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada correctamente.");
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("SettingScreen")}>
        <Ionicons name="arrow-back-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>

      <Text style={styles.title}>Eliminar Cuenta</Text>
      <Text style={styles.warning}>Esta acción no se puede deshacer.</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#e74c3c" style={styles.icon} />
        <TextInput
          placeholder="Confirma tu contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e74c3c" />
      ) : (
        <TouchableOpacity
          style={[styles.button, password.length < 6 && { opacity: 0.5 }]}
          onPress={handleDeleteAccount}
          disabled={password.length < 6}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  warning: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e74c3c",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 15,
    zIndex: 1,
  },
});

export default DeleteAccountScreen;
