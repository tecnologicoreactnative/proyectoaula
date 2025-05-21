import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates";
import { PaperProvider } from "react-native-paper";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "agendamientos"), where("usuarioId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    });

    return () => unsubscribe();
  }, []);

  const handleCancel = async (id) => {
    try {
      await deleteDoc(doc(db, "agendamientos", id));
      Alert.alert("Cita cancelada");
    } catch (error) {
      Alert.alert("Error al cancelar");
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setDateVisible(true);
  };

  const onDateConfirm = ({ date }) => {
    setNewDate(date);
    setDateVisible(false);
    setTimeVisible(true);
  };

  const onTimeConfirm = async ({ hours, minutes }) => {
    if (!selectedAppointment) return;

    const updatedDate = new Date(newDate);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    updatedDate.setSeconds(0);
    updatedDate.setMilliseconds(0);

    try {
      await updateDoc(doc(db, "agendamientos", selectedAppointment.id), {
        fecha: updatedDate.toISOString(),
      });
      Alert.alert("Cita reprogramada");
    } catch (error) {
      Alert.alert("Error al reprogramar");
    } finally {
      setTimeVisible(false);
      setSelectedAppointment(null);
    }
  };

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fecha);
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>
          {fecha.toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          a las {fecha.getHours()}:{fecha.getMinutes().toString().padStart(2, "0")}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rescheduleButton} onPress={() => handleReschedule(item)}>
            <Text style={styles.buttonText}>Reprogramar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Tus Citas</Text>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointments}>No tienes citas programadas.</Text>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}

        <DatePickerModal
          locale="es"
          mode="single"
          visible={dateVisible}
          onDismiss={() => setDateVisible(false)}
          onConfirm={onDateConfirm}
          validRange={{ startDate: new Date() }}
        />

        <TimePickerModal
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          onConfirm={onTimeConfirm}
          hours={new Date().getHours()}
          minutes={new Date().getMinutes()}
          label="Seleccionar hora"
          locale="es"
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  noAppointments: { textAlign: "center", fontSize: 16, color: "#999" },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: { fontSize: 16, marginBottom: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: {
    backgroundColor: "#ff5c5c",
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  rescheduleButton: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
