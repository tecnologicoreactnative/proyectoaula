import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

import AuthMainScreen from "../../components/AuthMainScreen";

import CompButton from "../../components/CompButton";
import CompInput from "../../components/CompInput";
import { useLogin } from "../../services/ServiceAuth";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const login = useLogin();

    const handleLogin = async () => {
        setLoading(true);
        await login(email, password);

        setLoading(false);
    };

    return (
        <AuthMainScreen>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <CompInput placeholder="Correo Electrónico" onChangeText={(text) => setEmail(text)} />
            <CompInput placeholder="Contraseña" secureTextEntry onChangeText={(text) => setPassword(text)} />
            <CompButton text="Entrar" onPress={handleLogin} />
            <CompButton text="¿Olvidaste tu contraseña?" onPress={() => navigation.navigate('Recover')} />
            <LoadingOverlay visible={loading} text="Ingresando..." />
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