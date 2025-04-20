import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Agendamiento = () => {
    const [selectedCita, setSelectedCita] = useState(null);

    const citas = [
        { id: '1', hora: '09:00 AM', descripcion: 'Consulta general' },
        { id: '2', hora: '10:00 AM', descripcion: 'Revisión dental' },
        { id: '3', hora: '11:00 AM', descripcion: 'Examen de laboratorio' },
        { id: '4', hora: '02:00 PM', descripcion: 'Consulta pediátrica' },
    ];

    const seleccionarCita = (cita) => {
        setSelectedCita(cita);
        alert(`Cita seleccionada: ${cita.hora} - ${cita.descripcion}`);
    };

    const renderCita = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.citaItem,
                selectedCita?.id === item.id && styles.citaSeleccionada,
            ]}
            onPress={() => seleccionarCita(item)}
        >
            <Text style={styles.citaHora}>{item.hora}</Text>
            <Text style={styles.citaDescripcion}>{item.descripcion}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Agenda de Citas</Text>
            <FlatList
                data={citas}
                keyExtractor={(item) => item.id}
                renderItem={renderCita}
                contentContainerStyle={styles.listaCitas}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    listaCitas: {
        paddingBottom: 20,
    },
    citaItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    citaSeleccionada: {
        backgroundColor: '#cce5ff',
        borderColor: '#007bff',
    },
    citaHora: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    citaDescripcion: {
        fontSize: 16,
        color: '#555',
    },
});

export default Agendamiento;