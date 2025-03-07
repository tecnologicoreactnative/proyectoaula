import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

import AuthMainScreen from "../../components/AuthMainScreen";

import CompButton from "../../components/CompButton";
import CompInput from "../../components/CompInput";
import { useLogin } from "../../services/ServiceAuth";

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const login = useLogin();

    const handleLogin = async () => {
        const success = await login(email, password);
        /*if (success) {
            navigation.getParent()?.navigate('Inside');
        }*/
    };

    return (
        <AuthMainScreen>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <CompInput placeholder="Correo Electrónico" onChangeText={(text) => setEmail(text)} />
            <CompInput placeholder="Contraseña" secureTextEntry onChangeText={(text) => setPassword(text)} />
            <CompButton text="Entrar" onPress={handleLogin} />
            <CompButton text="¿Olvidaste tu contraseña?" onPress={() => navigation.navigate('Recover')} />
        </AuthMainScreen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        marginBottom: 10,
        fontWeight: 'heavy'
    }
});