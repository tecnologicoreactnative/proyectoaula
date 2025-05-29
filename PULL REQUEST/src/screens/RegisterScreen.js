import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { sendPushNotification, registerForPushNotificationsAsync } from '../services/notifications';

const RegisterScreen = ({ navigation }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    lastName: "",
    typedocument: "",
    documentNumber: "",
    genre: "",
    adress: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: newUser.name,
        email: newUser.email,
        typedocument: newUser.typedocument,
        documentNumber: newUser.documentNumber,
        genre: newUser.genre,
        adress: newUser.adress,
        phone: newUser.phone,
        role: "paciente",
      });

      const token = await registerForPushNotificationsAsync();

      if (token) {
        await sendPushNotification(token, {
          title: "Bienvenido a nuestro gestor de Citas",
          body: "¡Tu registro fue exitoso!"
        });
      }

      alert("Registro exitoso");
      navigation.navigate("Login");
    } catch (error) {
      alert("Error en el registro. Intenta nuevamente");
      if (error.code === "auth/email-already-in-use") {
        alert("El correo ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        alert("El correo no es válido");
      } else if (error.code === "auth/weak-password") {
        alert("La contraseña es muy débil");
      } else {
        alert("Error en el registro. Intenta nuevamente");
      }
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <UserForm newUser={newUser} setNewUser={setNewUser} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}> Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

export const UserForm = ({ newUser, setNewUser }) => {
  return (
    <>
      <TextInput
        placeholder="Nombre"
        value={newUser.name}
        onChangeText={(name) => setNewUser({ ...newUser, name })}
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />
      <TextInput
        placeholder="Apellido"
        value={newUser.lastName}
        onChangeText={(lastName) => setNewUser({ ...newUser, lastName })}
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />

      <TextInput
        placeholder="Dirección"
        value={newUser.adress}
        onChangeText={(adress) => setNewUser({ ...newUser, adress })}
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />
      <TextInput
        placeholder="Teléfono"
        value={newUser.phone}
        onChangeText={(phone) => setNewUser({ ...newUser, phone })}
        style={styles.input}
        keyboardType="phone-pad"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />
      <Picker
        selectedValue={newUser.typedocument}
        onValueChange={(itemValue) =>
          setNewUser({ ...newUser, typedocument: itemValue })
        }
        style={styles.pickerContainer}
        dropdownIconColor="#274b6a"
        mode="dropdown"
      >
        <Picker.Item label="Cédula de Ciudadanía" value="CC" />
        <Picker.Item label="Cédula de Extranjería" value="CE" />
        <Picker.Item label="Tarjeta de Identidad" value="TI" />
      </Picker>

      <TextInput
        placeholder="Número de Documento"
        value={newUser.documentNumber}
        onChangeText={(documentNumber) =>
          setNewUser({ ...newUser, documentNumber })
        }
        style={styles.input}
        keyboardType="numeric"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />

      <Picker
        selectedValue={newUser.genre}
        onValueChange={(itemValue) =>
          setNewUser({ ...newUser, genre: itemValue })
        }
        style={styles.pickerContainer}
        dropdownIconColor="#274b6a"
        mode="dropdown"
      >
        <Picker.Item label="Masculino" value="M" />
        <Picker.Item label="Femenino" value="F" />
        <Picker.Item label="No Binario" value="NB" />
        <Picker.Item label="Prefiero no decirlo" value="ND" />
      </Picker>

      <TextInput
        placeholder="Correo Electrónico"
        value={newUser.email}
        onChangeText={(email) => setNewUser({ ...newUser, email })}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#274b6a"
      />
      <TextInput
        placeholder="Contraseña"
        value={newUser.password}
        onChangeText={(password) => setNewUser({ ...newUser, password })}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#274b6a"
      />
    </>
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
  pickerContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderColor: "transparent",
    borderRadius: 5,
    marginBottom: 15,
    color: "#274b6a",
  },
  picker: {
    height: 50,
    color: "#274b6a", 
  },
  button: {
    backgroundColor: "#274b6a",
    borderRadius: 5,
    paddingVertical: 12,
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
  loginText: {
    color: "#274b6a",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
//** */
//** */
