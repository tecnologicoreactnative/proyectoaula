import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  Provider as PaperProvider,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

export default function Schedule() {
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState(undefined);

  const showDatePicker = () => setDateVisible(true);
  const hideDatePicker = () => setDateVisible(false);
  const onDateConfirm = ({ date }) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => setTimeVisible(true);
  const hideTimePicker = () => setTimeVisible(false);
  const onTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const handleSchedule = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !selectedDate || !selectedTime) {
      Alert.alert("Datos incompletos", "Selecciona fecha y hora.");
      return;
    }

    const fullDate = new Date(selectedDate);
    fullDate.setHours(selectedTime.hours);
    fullDate.setMinutes(selectedTime.minutes);
    fullDate.setSeconds(0);
    fullDate.setMilliseconds(0);

    try {
      await addDoc(collection(db, "agendamientos"), {
        usuarioId: user.uid,
        fecha: fullDate.toISOString(),
        timestamp: serverTimestamp(),
      });
      Alert.alert("Éxito", "¡Cita agendada con éxito!");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    } catch (error) {
      console.error("Error al agendar:", error);
      Alert.alert("Error", "Hubo un problema al agendar la cita.");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Agendar Visita</Title>

            <Button
              icon="calendar"
              mode="contained"
              onPress={showDatePicker}
              style={styles.button}
            >
              Seleccionar Fecha
            </Button>

            {selectedDate && (
              <Paragraph style={styles.text}>
                Fecha:{" "}
                {selectedDate.toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Paragraph>
            )}

            <Button
              icon="clock"
              mode="contained"
              onPress={showTimePicker}
              style={styles.button}
            >
              Seleccionar Hora
            </Button>

            {selectedTime && (
              <Paragraph style={styles.text}>
                Hora: {selectedTime.hours}:
                {selectedTime.minutes.toString().padStart(2, "0")}
              </Paragraph>
            )}

            <Button
              mode="contained-tonal"
              onPress={handleSchedule}
              style={[styles.button, { marginTop: 25 }]}
            >
              Agendar Cita
            </Button>
          </Card.Content>
        </Card>

        <DatePickerModal
          locale="es"
          mode="single"
          visible={dateVisible}
          onDismiss={hideDatePicker}
          date={selectedDate}
          onConfirm={onDateConfirm}
          validRange={{ startDate: new Date() }}
        />

        <TimePickerModal
          visible={timeVisible}
          onDismiss={hideTimePicker}
          onConfirm={onTimeConfirm}
          hours={selectedTime?.hours || new Date().getHours()}
          minutes={selectedTime?.minutes || new Date().getMinutes()}
          label="Seleccionar hora"
          locale="es"
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 15,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});
