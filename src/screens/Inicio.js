import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#274b6a',
        borderRadius: 5,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#274b6a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

const Inicio = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a la Aplicación</Text>
           
           
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate ('EspecialistPortal')}>
                <Text style={styles.buttonText}>Iniciar sesión como Especialista</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}> onPress={()=> navigation.navigate ('Paciente')}
                <Text style={styles.buttonText}>Iniciar sesión como Paciente</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Inicio;
