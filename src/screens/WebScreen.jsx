import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const WebScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [citas, setCitas] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
       
        const usuariosSnap = await getDocs(collection(db, "users"));
        setUsuarios(usuariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

       
        const dispSnap = await getDocs(collection(db, "disponibilidad"));
        setDisponibilidad(dispSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        
        const citasSnap = await getDocs(collection(db, "citas"));
        setCitas(citasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

       
        const patientsSnap = await getDocs(collection(db, "patients"));
        setPatients(patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#274b6a" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Usuarios en la base de datos</Text>
      {usuarios.map(usuario => (
        <View key={usuario.id} style={styles.userCard}>
          <Text style={styles.userText}>Nombre: {usuario.name}</Text>
          <Text style={styles.userText}>Correo: {usuario.email}</Text>
          <Text style={styles.userText}>Rol: {usuario.role}</Text>
          <Text style={styles.userText}>Documento: {usuario.typedocument} {usuario.documentNumber}</Text>
          <Text style={styles.userText}>Teléfono: {usuario.phone}</Text>
          <Text style={styles.userText}>Dirección: {usuario.adress}</Text>
        </View>
      ))}

      <Text style={styles.title}>Disponibilidad</Text>
      {disponibilidad.map(item => (
        <View key={item.id} style={styles.userCard}>
          <Text style={styles.userText}>Especialista: {item.especialista}</Text>
          <Text style={styles.userText}>Fecha: {item.fecha}</Text>
          <Text style={styles.userText}>Hora: {item.hora}</Text>
          <Text style={styles.userText}>Estado: {item.estado}</Text>
        </View>
      ))}

      <Text style={styles.title}>Citas</Text>
      {citas.map(item => (
        <View key={item.id} style={styles.userCard}>
          <Text style={styles.userText}>Paciente: {item.paciente}</Text>
          <Text style={styles.userText}>Especialista: {item.especialista}</Text>
          <Text style={styles.userText}>Fecha: {item.fecha}</Text>
          <Text style={styles.userText}>Hora: {item.hora}</Text>
          <Text style={styles.userText}>Estado: {item.estado}</Text>
        </View>
      ))}

      <Text style={styles.title}>Pacientes</Text>
      {patients.map(item => (
        <View key={item.id} style={styles.userCard}>
          <Text style={styles.userText}>Nombre: {item.name}</Text>
          <Text style={styles.userText}>Correo: {item.email}</Text>
          <Text style={styles.userText}>Teléfono: {item.phone}</Text>
          <Text style={styles.userText}>Dirección: {item.adress}</Text>
          <Text style={styles.userText}>Documento: {item.typedocument} {item.documentNumber}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, marginTop: 16, textAlign: "center" },
  userCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  userText: { fontSize: 16, marginBottom: 2 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default WebScreen;
//** */
//** */


