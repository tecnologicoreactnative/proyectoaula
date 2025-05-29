import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { AuthContext } from '../context/AutenticacionContext';


const Agendamiento = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const db = getFirestore();

  const onChangeDate = (event, selected) => {
    setShowDatePicker(false);
    if (selected) setSelectedDate(selected);
  };

  const onChangeTime = (event, selected) => {
    setShowTimePicker(false);
    if (selected) setSelectedTime(selected);
  };

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString();
  };

  const formatearHora = (hora) => {
    return hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const confirmarDisponibilidad = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Selecciona fecha y hora.');
      return;
    }

    const disponibilidad = {
      id_especialista: user.uid,
      fecha: selectedDate.toISOString().split('T')[0], 
      hora: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    try {
      await addDoc(collection(db, 'disponibilidad'), disponibilidad);
      alert(`Disponibilidad registrada para el : ${disponibilidad.fecha} a las ${disponibilidad.hora}`);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error('Error al registrar disponibilidad:', error);
      alert('Error al guardar la disponibilidad');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Disponibilidad</Text>
      <Text style={styles.subtitulo}>Selecciona la fecha y hora en que estarás disponible</Text>

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
        <Button title="Confirmar Disponibilidad" onPress={confirmarDisponibilidad} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeTime}
          is24Hour={false}
        />
      )}
    </View>
  );
};

export default Agendamiento;

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
    marginBottom: 20,
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
