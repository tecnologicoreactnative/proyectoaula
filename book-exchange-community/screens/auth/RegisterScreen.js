import React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';


import AuthMainScreen from "../../components/AuthMainScreen";
import CompButton from "../../components/CompButton";
import CompInput from "../../components/CompInput";
import { useRegister } from "../../services/ServiceAuth";

export default function RegisterScreen({ navigation }) {


    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const register = useRegister();

    const handleRegister = async () => {
        const success = await register(email, password);
        if (success) {
            navigation.navigate('Login');
        }
    };

    return (
        <AuthMainScreen>
            <Text style={styles.title}>Crear Cuenta</Text>
            <CompInput placeholder="Correo Electrónico" onChangeText={(text) => setEmail(text)} />
            <CompInput placeholder="Contraseña" secureTextEntry onChangeText={(text) => setPassword(text)} />
            <CompButton text="Registrarse" onPress={handleRegister} />
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
