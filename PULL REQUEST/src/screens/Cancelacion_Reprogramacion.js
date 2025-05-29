import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Platform, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, set, get } from 'firebase/database';
import { auth } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
//** *///** */

const Cancelacion_Reprogramacion = () => {
    const [appointmentId, setAppointmentId] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [reprogramDate, setReprogramDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();
    const userId = auth.currentUser?.uid;

    const fetchAppointmentDetails = async (appointmentId) => {
        if (!userId || !appointmentId) {
            Alert.alert("Error", "ID de usuario o de cita inválido.");
            return;
        }
        setIsLoading(true);
        const db = getDatabase();
        const appointmentRef = ref(db, `appointments/${userId}/${appointmentId}`);
        try {
            const snapshot = await get(appointmentRef);
            if (snapshot.exists()) {
                setAppointmentDetails(snapshot.val());
                setIsLoading(false);
            } else {
                Alert.alert("Error", "No se encontró la cita con ese ID.");
                setAppointmentDetails(null);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al obtener los detalles de la cita:", error);
            Alert.alert("Error", "No se pudieron cargar los detalles de la cita.");
            setIsLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!userId || !appointmentId || !cancelReason) {
            Alert.alert("Advertencia", "Por favor, ingrese el ID de la cita y el motivo de la cancelación.");
            return;
        }
        setIsLoading(true);
        const db = getDatabase();
        const appointmentRef = ref(db, `appointments/${userId}/${appointmentId}`);
        try {
            await set(appointmentRef, { ...appointmentDetails, status: 'Cancelada', cancelReason });
            Alert.alert("Éxito", "La cita ha sido cancelada.");
            setAppointmentId('');
            setCancelReason('');
            setAppointmentDetails(null);
            setIsLoading(false);
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            Alert.alert("Error", "No se pudo cancelar la cita.");
            setIsLoading(false);
        }
    };

    const handleReprogramAppointment = async () => {
        if (!userId || !appointmentId || !reprogramDate) {
            Alert.alert("Advertencia", "Por favor, ingrese el ID de la cita y la nueva fecha.");
            return;
        }
        setIsLoading(true);
        const db = getDatabase();
        const appointmentRef = ref(db, `appointments/${userId}/${appointmentId}`);
        try {
            await set(appointmentRef, { ...appointmentDetails, date: reprogramDate.toISOString(), status: 'Reprogramada' });
            Alert.alert("Éxito", "La cita ha sido reprogramada para el " + reprogramDate.toLocaleDateString());
            setAppointmentId('');
            setReprogramDate(new Date());
            setShowDatePicker(false);
            setAppointmentDetails(null);
            setIsLoading(false);
        } catch (error) {
            console.error("Error al reprogramar la cita:", error);
            Alert.alert("Error", "No se pudo reprogramar la cita.");
            setIsLoading(false);
        }
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || reprogramDate;
        setShowDatePicker(Platform.OS === 'ios');
        setReprogramDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cancelar / Reprogramar Cita</Text>
            <TextInput
                style={styles.input}
                placeholder="ID de la Cita"
                value={appointmentId}
                onChangeText={setAppointmentId}
                keyboardType="default"
            />
            <Button title="Buscar Cita" onPress={() => fetchAppointmentDetails(appointmentId)} />
            {isLoading && <Text>Cargando detalles de la cita...</Text>}
            {appointmentDetails && (
                <View style={styles.appointmentDetails}>
                    <Text>Detalles de la Cita:</Text>
                    <Text>Fecha: {new Date(appointmentDetails.date).toLocaleDateString()}</Text>
                </View>
            )}
            <Text style={styles.subtitle}>Cancelar Cita</Text>
            <TextInput
                style={styles.input}
                placeholder="Motivo de la Cancelación"
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
            />
            <Button title="Cancelar Cita" onPress={handleCancelAppointment} disabled={!appointmentDetails} />
            <Text style={styles.subtitle}>Reprogramar Cita</Text>
            <Button title="Seleccionar Nueva Fecha" onPress={showDatepicker} disabled={!appointmentDetails} />
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={reprogramDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}
            <Text>Nueva Fecha Seleccionada: {reprogramDate.toLocaleDateString()}</Text>
            <Button title="Reprogramar Cita" onPress={handleReprogramAppointment} disabled={!appointmentDetails} />
            <Button title="Volver" onPress={() => navigation.goBack()} style={styles.backButton} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    appointmentDetails: {
        marginTop: 15,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    backButton: {
        marginTop: 30,
    },
});

export default Cancelacion_Reprogramacion;
