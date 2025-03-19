import React, { useState } from "react";
import { View, Text, TextInput, Button, Touchable, TouchableOpacity, StyleSheet } from "react-native";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
/* import { useNavigation } from "@react-navigation/native"; */

export default function Register({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* const navigation = useNavigation(); */
  
  const redirectLogin = () => {
    navigation.navigate("Login");
  }

  const handleSignUp = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario registrado:", userCredential.user);
        navigation.navigate("Login");
      })
      .catch((error) => console.log("Error:", error.message));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Contraseña:</Text>
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <Button title="Registrarse" onPress={handleSignUp} />

      <TouchableOpacity onPress={redirectLogin} >
        <Text style={{display:"flex", justifyContent:"center", textAlign:"center", color:"blue", margin:5 }}>{"¿Ya tienes cuenta?"}</Text>
      </TouchableOpacity>
    </View>
  );
}

