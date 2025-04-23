import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Cancelacion_Reprogramacion = () => {
    const [id_Cancel_Reprogram, setid_Cancel_Reprogram] = useState(new Date());
    const [id_Appointment, setid_Appointment] = useState(new Date());
    const [TypeEvent, setTypeEvent] = useState();
    const [Date_Event, setDate_Event] = useState();
    const [isFirstTime, setIsFirstTime] = useState(true);


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
        if (selectedDate && selectedTime) {
            alert(`Cita agendada para el ${formatearFecha(selectedDate)} a las ${formatearHora(selectedTime)}`);
        } else {
            alert('Por favor selecciona fecha y hora.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecciona tu cita</Text>

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
});

export default Cancelacion_Reprogramacion;
