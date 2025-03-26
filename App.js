import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';


import NavegacionStack from './Navegacion/AuthStack'; 
import AuthStack from './Navegacion/NavegacionStack'; 
import { ProveedorAuth, AuthContexto } from './contextos/AuthContexto';


const Rutas = () => {
  const { usuario } = useContext(AuthContexto);
  return usuario ? <NavegacionStack /> : <AuthStack />;
};


const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential.user);
      })
      .catch((error) => console.log('Error:', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Registrarse!</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Ingresa tu email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Ingresa tu contraseña"
      />
      <Button title="Registrarse" onPress={handleSignUp} color="#6200EE" />
    </View>
  );
};


export default function App() {
  return (
    <ProveedorAuth>
      <NavigationContainer>
        <Rutas />
        { }
        <Registro />
      </NavigationContainer>
    </ProveedorAuth>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
});