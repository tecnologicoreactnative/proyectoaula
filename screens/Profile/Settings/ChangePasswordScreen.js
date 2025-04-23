import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useUsersContext } from "../../../context/UsersContext";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUsersContext();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleChangePassword = async () => {
    if (!user?.email) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      const success = await updateUser(user.email, {
        password: newPassword,
        updatedAt: new Date().toISOString(),
      });

      if (!success)
        throw new Error("No se pudo actualizar en la base de datos");

      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      Alert.alert("Error", error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SettingScreen")}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#3498db" />
      </TouchableOpacity>
      <Text style={styles.title}>Cambiar Contraseña</Text>

      <View style={styles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#3498db"
          style={styles.icon}
        />
        <TextInput
          placeholder="Contraseña actual"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons
          name="key-outline"
          size={20}
          color="#3498db"
          style={styles.icon}
        />
        <TextInput
          placeholder="Nueva contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons
          name="checkmark-done-outline"
          size={20}
          color="#3498db"
          style={styles.icon}
        />
        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            !(currentPassword && newPassword && confirmPassword) && {
              opacity: 0.5,
            },
          ]}
          onPress={handleChangePassword}
          disabled={!currentPassword || !newPassword || !confirmPassword}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Cambiar contraseña</Text>
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
    marginBottom: 32,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3498db",
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
    backgroundColor: "#3498db",
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
  }
});

export default ChangePasswordScreen;
