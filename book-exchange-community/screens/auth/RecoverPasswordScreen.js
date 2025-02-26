import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    TextInput
} from 'react-native';

export default function RecoverPasswordScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <TextInput
                placeholder="Ingresa tu correo electrónico"
                style={styles.input}
            />
            <Button
                title="Recuperar"
                onPress={() => alert('Se ha enviado un correo de recuperación')}
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