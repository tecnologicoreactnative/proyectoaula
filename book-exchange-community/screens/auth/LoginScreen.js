import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    TextInput, Alert, ImageBackground
} from 'react-native';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../lib/Firebase';
import Background from "../../assets/Background.png";
import { AppContext } from "../../components/AppContext";



export default function LoginScreen({ navigation }) {

    const auth = getAuth(app);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { IsAuthenticated, setIsAuthenticated } = React.useContext(AppContext);
    const { user, setUser } = React.useContext(AppContext);

    const handleLoginWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);
                setIsAuthenticated(true);
                navigation.getParent()?.navigate('Inside');
                navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Inside' }],
                });
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
            <ImageBackground
                source={Background}
                style={styles.background}
            >
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <TextInput
                        placeholder="Correo electrónico"
                        style={styles.input}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        placeholder="Contraseña"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <Button
                        title="Entrar"
                        onPress={handleLoginWithEmail}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
                        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '100%',
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