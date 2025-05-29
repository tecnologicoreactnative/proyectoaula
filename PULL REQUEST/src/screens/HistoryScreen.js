import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { AuthContext } from "../context/AutenticacionContext";

const HistoryScreen = () => {
  const { user } = useContext(AuthContext);
  const [descripcion, setDescripcion] = useState("");
  const [historial, setHistorial] = useState([]);
  const [citas, setCitas] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("historial");

  const esEspecialista = user?.role === "especialista";

  const obtenerPaciente = async () => {
    if (user.role === "paciente") {
      return user.uid;
    }

    if (esEspecialista) {
      const q = query(
        collection(db, "citas"),
        where("id_especialista", "==", user.uid),
        where("id_paciente", "!=", null)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data().id_paciente;
      }
    }

    return null;
  };

  const crearHistorialMedico = async (pacienteId, descripcion) => {
    try {
      const docRef = await addDoc(collection(db, "historial"), {
        pacienteId,
        especialistaId: user.uid,
        descripcion,
        fecha: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error al crear historial médico:", error);
      throw error;
    }
  };

  const obtenerHistorial = async (pacienteId) => {
    try {
      const q = query(
        collection(db, "historial"),
        where("pacienteId", "==", pacienteId),
        where("especialistaId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistorial(datos);
    } catch (error) {
      console.error("Error obteniendo historial:", error);
    }
  };

  const obtenerCitas = async (pacienteId) => {
    try {
      let q;
      if (pacienteId) {
        q = query(
          collection(db, "citas"),
          where("id_paciente", "==", pacienteId),
          where("id_especialista", "==", user.uid)
        );
      } else {
        q = query(
          collection(db, "citas"),
          where("id_especialista", "==", user.uid)
        );
      }

      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCitas(datos);
    } catch (error) {
      console.error("Error obteniendo citas:", error);
    }
  };

  const agregarRegistro = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Campo vacío", "Ingresa una descripción antes de guardar.");
      return;
    }

    try {
      await crearHistorialMedico(pacienteId, descripcion);
      setDescripcion("");
      await obtenerHistorial(pacienteId);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el historial.");
    }
  };
//** *///** */

  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      try {
        if (esEspecialista) {
          const paciente = await obtenerPaciente();
          setPacienteId(paciente);
          await obtenerHistorial(paciente);
          await obtenerCitas(paciente);
        } else {
          setPacienteId(user.uid);
          await obtenerCitas(user.uid);
        }
      } catch (error) {
        console.error("Error al inicializar:", error);
        Alert.alert("Error", "Hubo un problema al cargar los datos.");
      }
      setLoading(false);
    };

    inicializar();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {esEspecialista ? "Historial Médico y Citas" : "Mis Citas"}
      </Text>

      {esEspecialista && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "historial" && styles.activeTab]}
            onPress={() => setActiveTab("historial")}
          >
            <Text style={styles.tabText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "citas" && styles.activeTab]}
            onPress={() => setActiveTab("citas")}
          >
            <Text style={styles.tabText}>Citas</Text>
          </TouchableOpacity>
        </View>
      )}

      {esEspecialista && activeTab === "historial" ? (
        <>
          <ScrollView style={styles.scroll}>
            {historial.length > 0 ? (
              historial.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.fecha}>{item.fecha.toDate().toLocaleString()}</Text>
                  <Text>{item.descripcion}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No hay registros de historial</Text>
            )}
          </ScrollView>

          {pacienteId && (
            <>
              <TextInput
                placeholder="Añadir descripción médica..."
                value={descripcion}
                onChangeText={setDescripcion}
                style={styles.input}
              />

              <TouchableOpacity style={styles.button} onPress={agregarRegistro}>
                <Text style={styles.buttonText}>Guardar Registro</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <ScrollView style={styles.scroll}>
          {citas.length > 0 ? (
            citas.map((cita) => (
              <View key={cita.id} style={styles.card}>
                <Text style={styles.fecha}>Fecha: {cita.fecha}</Text>
                <Text>Hora: {cita.hora}</Text>
                {esEspecialista && <Text>Paciente: {cita.nombre_paciente}</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay citas programadas</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  activeTab: {
    backgroundColor: "#1976D2",
  },
  tabText: {
    color: "#000",
  },
  scroll: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  fecha: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});