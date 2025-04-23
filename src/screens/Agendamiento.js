import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const Agendamiento = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [especialistaAsignado, setEspecialistaAsignado] = useState(null);
    const [isLoadingEspecialistas, setIsLoadingEspecialistas] = useState(true);
    const [errorEspecialistas, setErrorEspecialistas] = useState(null);

    useEffect(() => {
        const fetchEspecialistas = async () => {
            const db = getFirestore();
            const especialistasCollection = collection(db, 'EspecialistPortal');
            try {
                const querySnapshot = await getDocs(especialistasCollection);
                const especialistasArray = [];
                querySnapshot.forEach((doc) => {
                    especialistasArray.push(doc.data());
                });

                if (especialistasArray.length > 0) {
                    const randomIndex = Math.floor(Math.random() * especialistasArray.length);
                    setEspecialistaAsignado(especialistasArray[randomIndex]);
                } else {
                    setErrorEspecialistas('No hay especialistas disponibles.');
                }
            } catch (error) {
                console.error('Error al obtener especialistas:', error);
                setErrorEspecialistas('Error al cargar la información del especialista.');
            } finally {
                setIsLoadingEspecialistas(false);
            }
        };

        fetchEspecialistas();
    }, []);

    const onChangeDate = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    const onChangeTime = (event, selected) => {
        setShowTimePicker(false);
        if (selected) {
            setSelectedTime(selected);
        }
    };

    const formatearFecha = (fecha) => {
        return fecha.toLocaleDateString();
    };

    const formatearHora = (hora) => {
        return hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const confirmarCita = () => {
        if (selectedDate && selectedTime && especialistaAsignado) {
            alert(`Cita agendada para el ${formatearFecha(selectedDate)} a las ${formatearHora(selectedTime)} con ${especialistaAsignado.FullName}.`);
        } else if (!selectedDate || !selectedTime) {
            alert('Por favor selecciona fecha y hora.');
        } else if (!especialistaAsignado && !errorEspecialistas) {
            alert('No se pudo asignar un especialista. Inténtalo de nuevo.');
        } else if (errorEspecialistas) {
            alert(errorEspecialistas);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecciona tu cita</Text>

            {isLoadingEspecialistas ? (
                <Text>Cargando especialista...</Text>
            ) : errorEspecialistas ? (
                <Text style={styles.error}>{errorEspecialistas}</Text>
            ) : especialistaAsignado ? (
                <View style={styles.infoEspecialista}>
                    <Text style={styles.subtitulo}>Tu especialista asignado es:</Text>
                    <Text>{especialistaAsignado.FullName}</Text>
                    <Text>Especialidad: {especialistaAsignado.specialty}</Text>
                </View>
            ) : null}

            <View style={styles.botonContainer}>
                <Button title="Elegir Fecha" onPress={() => setShowDatePicker(true)} />
                {selectedDate && (
                    <Text style={styles.seleccionado}>📅 {formatearFecha(selectedDate)}</Text>
                )}
            </View>

            <View style={styles.botonContainer}>
                <Button title="Elegir Hora" onPress={() => setShowTimePicker(true)} />
                {selectedTime && (
                    <Text style={styles.seleccionado}>⏰ {formatearHora(selectedTime)}</Text>
                )}
            </View>

            <View style={styles.confirmarContainer}>
                <Button title="Confirmar Cita" onPress={confirmarCita} />
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    is24Hour={false}
                    onChange={onChangeTime}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
    },
    botonContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    seleccionado: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    confirmarContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    infoEspecialista: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Agendamiento;