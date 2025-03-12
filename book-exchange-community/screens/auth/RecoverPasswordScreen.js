import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';

import AuthMainScreen from "../../components/AuthMainScreen";
import CompButton from "../../components/CompButton";
import CompInput from "../../components/CompInput";
import { useRecoverPassword } from "../../services/ServiceAuth";


export default function RecoverPasswordScreen() {

    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const recoverPassword = useRecoverPassword();

    const handleRecoverPassword = async () => {
        setLoading(true);
        await recoverPassword(email);
        setLoading(false);
    }

    return (
        <AuthMainScreen>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <CompInput placeholder="Ingresa tu correo electrónico" onChangeText={(text) => setEmail(text) } />
            <CompButton text="Recuperar" onPress={handleRecoverPassword}/>
        </AuthMainScreen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold'
    }
});