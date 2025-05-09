import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
<<<<<<< HEAD
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { Picker } from '@react-native-picker/picker';
=======
import { auth } from '../services/firebaseConfig';
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: role,
      });
      alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('El correo ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        alert('El correo no es válido');
      } else if (error.code === 'auth/weak-password') {
        alert('La contraseña es muy débil');
      } else {
        alert('Error en el registro. Intenta nuevamente');
      }
    
    }

  };

=======

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Registro exitoso:', userCredential.user);
        alert('Registro exitoso');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        alert('Error en el registro');
      });
  };

  
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
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
<<<<<<< HEAD

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
        >
          <Picker.Item label="Seleccionar Rol" value="" color="#274b6a" />
          <Picker.Item label="Paciente" value="paciente" color="#274b6a" />
          <Picker.Item label="Especialista" value="especialista" color="#274b6a" />
        </Picker>
      </View>

=======
      
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#274b6a',
  },
<<<<<<< HEAD
  pickerContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 5,
    marginBottom: 15,
    color: '#274b6a',
  },
  picker: {
    height: 50,
    color: '#274b6a', // Asegúrate de que el texto del picker sea visible
  },
  button: {
    backgroundColor: '#274b6a',
    borderRadius: 5,
    paddingVertical: 12,
=======
  button: {
    backgroundColor: '#274b6a',
    borderRadius: 5,
    paddingVertical: 6,
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#274b6a',
    fontWeight: 'bold',
  },
});

<<<<<<< HEAD
export default RegisterScreen;
=======
export default RegisterScreen;
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
