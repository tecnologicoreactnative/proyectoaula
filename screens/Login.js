import React, { useState } from "react";
import { View, Text, TextInput, Button, Touchable, TouchableOpacity } from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
/* import { useNavigation } from "@react-navigation/native"; */

export default function Login({navigation}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* const navigation = useNavigation(); */

  const redirectRegister = () => {
    navigation.navigate("Register");
  }
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Sesion iniciada:", userCredential.user);
        navigation.navigate("Home");
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
      <Button title="Login" onPress={handleSignIn} />
      <TouchableOpacity onPress={redirectRegister} >
              <Text style={{display:"flex", justifyContent:"center", textAlign:"center", color:"blue", margin:5 }}>{"Registrate con nosotros :)"}</Text>
      </TouchableOpacity>

    </View>

  );
}
