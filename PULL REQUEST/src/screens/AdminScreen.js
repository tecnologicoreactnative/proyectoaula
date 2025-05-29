import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { UserForm } from "./RegisterScreen";
//** */ //** */
const initialUser = {
  name: "",
  lastName: "",
  typedocument: "CC",
  documentNumber: "",
  genre: "",
  adress: "",
  phone: "",
  email: "",
  password: "",
  role: "paciente",
};

const AdminScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const [createSpecialistModal, setCreateSpecialistModal] = useState(false);
  const [newUser, setNewUser] = useState(initialUser);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showListModal, setShowListModal] = useState(false);

  const [newPatientDocumentType, setNewPatientDocumentType] = useState("CC");
  const [newSpecialistDocumentType, setNewSpecialistDocumentType] = useState("CC");

  // Estados para citas
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);

  
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const patientsList = [];
      const specialistsList = [];
      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        const user = { id: docSnap.id, ...userData };
        if (user.role === "paciente") patientsList.push(user);
        if (user.role === "especialista") specialistsList.push(user);
      });
      setPatients(patientsList);
      setSpecialists(specialistsList);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // Obtener info admin
  const fetchAdminInfo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdminInfo({ id: docSnap.id, ...docSnap.data() });
        }
      }
    } catch (error) {
      console.error("Error al obtener información del administrador:", error);
    }
  };

  // Obtener citas
  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "citas"));
      const citasList = [];
      querySnapshot.forEach((docSnap) => {
        const cita = { id: docSnap.id, ...docSnap.data() };
        citasList.push(cita);
      });
      setAppointments(citasList);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };

  // Editar cita
  const handleEditAppointment = async () => {
    try {
      const citaRef = doc(db, "citas", editAppointment.id);
      await updateDoc(citaRef, {
        fecha: editAppointment.fecha,
        hora: editAppointment.hora,
        estado: editAppointment.estado,
      });
      setEditAppointment(null);
      fetchAppointments();
      alert("Cita actualizada exitosamente.");
    } catch (error) {
      console.error("Error al editar cita:", error);
      alert("Error al editar cita.");
    }
  };

  // Cancelar cita
  const handleCancelAppointment = async (id) => {
    try {
      const citaRef = doc(db, "citas", id);
      await updateDoc(citaRef, { estado: "cancelada" });
      fetchAppointments();
      alert("Cita cancelada exitosamente.");
    } catch (error) {
      console.error("Error al cancelar cita:", error);
      alert("Error al cancelar cita.");
    }
  };

  // Crear paciente
  const handleCreatePatient = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: newUser.name,
        email: newUser.email,
        typedocument: newPatientDocumentType,
        documentNumber: newUser.documentNumber,
        genre: newUser.genre,
        adress: newUser.adress,
        phone: newUser.phone,
        role: "paciente",
      });
      fetchUsers();
      setCreatePatientModal(false);
      setNewUser(initialUser);
      setNewPatientDocumentType("CC");
      alert("Paciente creado exitosamente.");
    } catch (error) {
      console.error("Error al crear paciente:", error);
      alert("Error al crear paciente.");
    }
  };

  // Crear especialista
  const handleCreateSpecialist = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: newUser.name,
        email: newUser.email,
        typedocument: newSpecialistDocumentType,
        documentNumber: newUser.documentNumber,
        genre: newUser.genre,
        adress: newUser.adress,
        phone: newUser.phone,
        role: "especialista",
      });
      fetchUsers();
      setCreateSpecialistModal(false);
      setNewUser(initialUser);
      setNewSpecialistDocumentType("CC");
      alert("Especialista creado exitosamente.");
    } catch (error) {
      console.error("Error al crear especialista:", error);
      alert("Error al crear especialista.");
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
      alert("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario.");
    }
  };

  // Editar usuario
  const handleEditUser = async () => {
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        name: selectedUser.name,
        typedocument: selectedUser.typedocument,
        email: selectedUser.email,
        role: selectedUser.role,
      });
      setModalVisible(false);
      setSelectedUser(null);
      fetchUsers();
      alert("Usuario actualizado exitosamente.");
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("Error al editar usuario.");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleVerEnWeb = () => {
    navigation.navigate("WebScreen");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Error al cerrar sesión.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.itemText}>Nombre: <Text style={styles.bold}>{item.name}</Text></Text>
        <Text style={styles.itemText}>Tipo Documento: <Text style={styles.bold}>{item.typedocument}</Text></Text>
        <Text style={styles.itemText}>Correo: <Text style={styles.bold}>{item.email}</Text></Text>
        <Text style={styles.itemText}>Rol: <Text style={styles.bold}>{item.role}</Text></Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar cada cita
  const renderAppointmentItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>Fecha: <Text style={styles.bold}>{item.fecha}</Text></Text>
      <Text style={styles.itemText}>Hora: <Text style={styles.bold}>{item.hora}</Text></Text>
      <Text style={styles.itemText}>Paciente: <Text style={styles.bold}>{item.nombre_paciente || item.pacienteNombre || item.paciente || ""}</Text></Text>
      <Text style={styles.itemText}>Especialista: <Text style={styles.bold}>{item.nombre_especialista || item.especialistaNombre || item.especialista || ""}</Text></Text>
      <Text style={styles.itemText}>Estado: <Text style={styles.bold}>{item.estado}</Text></Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditAppointment({ ...item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleCancelAppointment(item.id)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const openListModal = () => {
    setShowListModal(true);
  };

  useEffect(() => {
    fetchUsers();
    fetchAdminInfo();
    fetchAppointments();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Información del Administrador */}
        {adminInfo && (
          <View style={styles.adminInfoContainer}>
            <Text style={styles.adminInfoTitle}>👤 Información del Administrador</Text>
            <Text style={styles.adminInfoText}>Nombre: <Text style={styles.bold}>{adminInfo.name}</Text></Text>
            <Text style={styles.adminInfoText}>Correo: <Text style={styles.bold}>{adminInfo.email}</Text></Text>
            <Text style={styles.adminInfoText}>Rol: <Text style={styles.bold}>{adminInfo.role}</Text></Text>
          </View>
        )}

        {/* Lista de usuarios y citas */}
        <ScrollView style={{ flex: 1 }}>
          {/* Aquí puedes agregar contenido scrollable si lo necesitas */}
        </ScrollView>

        {/* Botones inferiores */}
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.createPatientButton}
              onPress={() => setCreatePatientModal(true)}
            >
              <Text style={styles.buttonText}>➕ Paciente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createSpecialistButton}
              onPress={() => setCreateSpecialistModal(true)}
            >
              <Text style={styles.buttonText}>➕ Especialista</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewListButton}
              onPress={openListModal}
            >
              <Text style={styles.buttonText}>👥 Usuarios</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.viewWebButton} onPress={handleVerEnWeb}>
              <Text style={styles.buttonText}>🌐 Ver en la Web</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewWebButton, { backgroundColor: "#673ab7" }]}
              onPress={() => setShowAppointmentsModal(true)}
            >
              <Text style={styles.buttonText}>📅 Ver Citas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>🚪 Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modales */}
        {/* Modal para la lista de pacientes y especialistas */}
        <Modal visible={showListModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>👥 Lista de Usuarios</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Pacientes</Text>
              <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay pacientes registrados.</Text>}
              />
              <Text style={styles.title}>Especialistas</Text>
              <FlatList
                data={specialists}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay especialistas registrados.</Text>}
              />
            </View>
            <Button title="Cerrar" onPress={() => setShowListModal(false)} color="#673ab7" />
          </View>
        </Modal>

        {/* Modal para ver citas */}
        <Modal visible={showAppointmentsModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📅 Citas Agendadas</Text>
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              renderItem={renderAppointmentItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No hay citas agendadas.</Text>}
            />
            <Button title="Cerrar" onPress={() => setShowAppointmentsModal(false)} color="#673ab7" />
          </View>
        </Modal>

        {/* Modal para editar cita */}
        <Modal visible={!!editAppointment} animationType="slide" transparent={false}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>✏️ Editar Cita</Text>
            <TextInput
              style={styles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={editAppointment?.fecha || ""}
              onChangeText={(text) =>
                setEditAppointment({ ...editAppointment, fecha: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Hora (HH:MM)"
              value={editAppointment?.hora || ""}
              onChangeText={(text) =>
                setEditAppointment({ ...editAppointment, hora: text })
              }
            />
            <Picker
              selectedValue={editAppointment?.estado}
              onValueChange={(value) =>
                setEditAppointment({ ...editAppointment, estado: value })
              }
              style={styles.input}
            >
              <Picker.Item label="Agendada" value="agendada" />
              <Picker.Item label="Cancelada" value="cancelada" />
              <Picker.Item label="Reprogramada" value="reprogramada" />
              <Picker.Item label="Completada" value="completada" />
            </Picker>
            <View style={styles.modalButtons}>
              <Button title="Guardar cambios" onPress={handleEditAppointment} color="#46a7c6" />
              <Button
                title="Cancelar"
                onPress={() => setEditAppointment(null)}
                color="#E73F33"
              />
            </View>
          </View>
        </Modal>

        {/* Modal para crear paciente */}
        <Modal visible={createPatientModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>➕ Crear Paciente</Text>
            <UserForm newUser={newUser} setNewUser={setNewUser} />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newPatientDocumentType}
                onValueChange={(value) => setNewPatientDocumentType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Cédula de Ciudadanía" value="CC" />
                <Picker.Item label="Cédula de Extranjería" value="CE" />
                <Picker.Item label="Tarjeta de Identidad" value="TI" />
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Crear Paciente" onPress={handleCreatePatient} color="#46a7c6" />
              <Button
                title="Cancelar"
                onPress={() => setCreatePatientModal(false)}
                color="#E73F33"
              />
            </View>
          </View>
        </Modal>

        {/* Modal para crear especialista */}
        <Modal visible={createSpecialistModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>➕ Crear Especialista</Text>
            <UserForm newUser={newUser} setNewUser={setNewUser} />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newSpecialistDocumentType}
                onValueChange={(value) => setNewSpecialistDocumentType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Cédula de Ciudadanía" value="CC" />
                <Picker.Item label="Cédula de Extranjería" value="CE" />
                <Picker.Item label="Tarjeta de Identidad" value="TI" />
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Crear Especialista" onPress={handleCreateSpecialist} color="#46a7c6" />
              <Button
                title="Cancelar"
                onPress={() => setCreateSpecialistModal(false)}
                color="#E73F33"
              />
            </View>
          </View>
        </Modal>

        {/* Modal para editar usuario */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>✏️ Editar Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={selectedUser?.name || ""}
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, name: text })
              }
            />
            <Picker
              selectedValue={selectedUser?.typedocument}
              onValueChange={(itemValue) =>
                setSelectedUser({ ...selectedUser, typedocument: itemValue })
              }
              style={styles.pickerContainer}
            >
              <Picker.Item label="Cédula de Ciudadanía" value="CC" />
              <Picker.Item label="Cédula de Extranjería" value="CE" />
              <Picker.Item label="Tarjeta de Identidad" value="TI" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={selectedUser?.email || ""}
              onChangeText={(text) =>
                setSelectedUser({ ...selectedUser, email: text })
              }
            />
            <Picker
              selectedValue={selectedUser?.role}
              onValueChange={(itemValue) =>
                setSelectedUser({ ...selectedUser, role: itemValue })
              }
              style={styles.input}
            >
              <Picker.Item label="Paciente" value="paciente" />
              <Picker.Item label="Especialista" value="especialista" />
            </Picker>
            <View style={styles.modalButtons}>
              <Button title="Guardar cambios" onPress={handleEditUser} color="#46a7c6" />
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#E73F33"
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "flex-start",
  },
  adminInfoContainer: {
    backgroundColor: "#e0f7fa",
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#46a7c6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  adminInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#00796B",
  },
  adminInfoText: {
    fontSize: 16,
    marginBottom: 2,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  listContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#673ab7",
    textAlign: "center",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 7,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#673ab7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#46a7c6",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E73F33",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#46a7c6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  bottomButtonsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    left: 0,
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  createPatientButton: {
    backgroundColor: "#46a7c6",
    padding: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    elevation: 2,
  },
  createSpecialistButton: {
    backgroundColor: "#46a7c6",
    padding: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    elevation: 2,
  },
  viewListButton: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    elevation: 2,
  },
  viewWebButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    elevation: 3,
    width: "32%",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    elevation: 3,
    width: "32%",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
    fontSize: 16,
  },
});

export default AdminScreen;



