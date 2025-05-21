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


//desde aca hacia abajo no tocar

/*import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";

const Schedule = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { property } = route.params;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    setShowDatePicker(false);
    setDate(selectedDate);
    setShowTimePicker(true); // luego muestra el selector de hora
  };

  const onChangeTime = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }

    const updatedDate = new Date(date);
    updatedDate.setHours(selectedTime.getHours());
    updatedDate.setMinutes(selectedTime.getMinutes());

    setShowTimePicker(false);
    setDate(updatedDate);
  };

  const handleConfirm = () => {
    Alert.alert(
      "Visita Agendada",
      `Has agendado una visita al inmueble "${property.titulo}" el ${date.toLocaleDateString()} a las ${date.toLocaleTimeString()}.`
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Visita</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Seleccionar Fecha y Hora</Text>
      </TouchableOpacity>

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
          onChange={onChangeTime}
        />
      )}

      <Text style={styles.selectedDate}>
        Fecha y hora seleccionada:{" "}
        {`${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`}
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  selectedDate: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
});*/
