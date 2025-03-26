import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './Navigation/NavigationStack'; // Flujo principal
import AuthStack from './Navigation/AuthStack'; // Flujo de autenticación
import { ProveedorAuth, AuthContext } from './Context/AuthContext';

const Rutas = () => {
  const { usuario } = useContext(AuthContext);
  return usuario ? <NavigationStack /> : <AuthStack />;
};
export default function App() {
  return (
    <ProveedorAuth>
      <NavigationContainer>
        <Rutas />
      </NavigationContainer>
    </ProveedorAuth>
  );
}


/*import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential.user);
      })
      .catch(error => console.log('Error:', error.message));

  };
  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput onChangeText={setEmail} style={{
        borderWidth: 1,
        marginBottom: 10
      }} />
      <Text>Contraseña:</Text>
      <TextInput secureTextEntry onChangeText={setPassword} style={{
        borderWidth: 1, marginBottom: 10
      }} />
      <Button title="Registrarse" onPress={handleSignUp} />
    </View>
  );
}*/
/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential.user);
        Alert.alert('Registro exitoso', 'El usuario se ha registrado correctamente.');
        setEmail('');
        setPassword('');
        setError('');
      })
      .catch(error => setError(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inmobiliaria JFK</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Ingrese su email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Ingrese su contraseña"
          style={styles.input}
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Registrarse" onPress={handleSignUp} disabled={!email || !password} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 15,
    alignItems: 'center', // Centra los textos "Email" y "Contraseña"
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
*/
