import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    TextInput, Alert
} from 'react-native';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../../lib/Firebase';


export default function RegisterScreen({ navigation }) {

    const auth = getAuth(app);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleRegisterWithEmail = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                Alert.alert('Registro exitoso', 'Usuario creado correctamente');
                navigation.navigate('Login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                Alert.alert('Error', errorMessage);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput
                placeholder="Correo Electrónico"
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                id="password"
                placeholder="Contraseña"
                secureTextEntry
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
            />
            <Button
                title="Registrarse"
                onPress={ handleRegisterWithEmail }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#EEF2FA'
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555'
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5
    },
    link: {
        marginTop: 10,
        color: '#3366BB',
        textDecorationLine: 'underline'
    }
});
