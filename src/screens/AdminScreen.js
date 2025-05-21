//** */
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
  Linking,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { UserForm } from "./RegisterScreen";

// WebScreen.js content (pasted directly)


const MostrarDatosFirebase = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios")); // Lee la colección "usuarios"
        const datosObtenidos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDatos(datosObtenidos);
      } catch (error) {
        console.error("Error al obtener datos: ", error);
        // Maneja el error de acuerdo a tus necesidades
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (loading) {
    return (
      <View style={stylesWeb.container}>
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={stylesWeb.container}>
      <Text style={stylesWeb.title}>Datos de Firebase</Text>
      {datos.map((item) => (
        <View key={item.id} style={stylesWeb.itemContainer}>
          <Text style={stylesWeb.itemText}>
            {item.id} =&gt; {JSON.stringify(item.nombre)}
          </Text>
          {/* Muestra otros campos de los datos aquí */}
        </View>
      ))}
    </ScrollView>
  );
};

const stylesWeb = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});
// End of WebScreen.js content

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

const AdminScreen = ({navigation}) => {
  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const [createSpecialistModal, setCreateSpecialistModal] = useState(false);
  const [newUser, setNewUser] = useState(initialUser);

  const [newPatientDocumentType, setNewPatientDocumentType] = useState("CC");
  const [newSpecialistDocumentType, setNewSpecialistDocumentType] =
    useState("CC");

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

  const handleCreateUser = async () => {
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
        typedocument: newUser.typedocument,
        documentNumber: newUser.documentNumber,
        genre: newUser.genre,
        adress: newUser.adress,
        phone: newUser.phone,
        role: "paciente",
      });

      fetchUsers();
      setCreatePatientModal(false);
      setNewUser(initialUser);
      alert("Paciente creado exitosamente.");
    } catch (error) {
      console.error("Error al crear paciente:", error);
      alert("Error al crear paciente.");
    }
  };

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


  const renderItem = ({ item }) => (
    <ScrollView>
      <View style={styles.listItem}>
        <View>
          <Text style={styles.itemText}>Nombre: {item.name}</Text>
          <Text style={styles.itemText}>
            Tipo Documento: {item.typedocument}
          </Text>
          <Text style={styles.itemText}>Correo: {item.email}</Text>
          <Text style={styles.itemText}>Rol: {item.role}</Text>
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
    </ScrollView>
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.title}>Pacientes</Text>
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <Text style={styles.title}>Especialistas</Text>
        <FlatList
          data={specialists}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createPatientButton}
          onPress={() => setCreatePatientModal(true)}
        >
          <Text style={styles.buttonText}>Crear Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createSpecialistButton}
          onPress={() => setCreateSpecialistModal(true)}
        >
          <Text style={styles.buttonText}>Crear Especialista</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity style={styles.viewWebButton} onPress={handleVerEnWeb}>
            <Text style={styles.buttonText}>Ver en la Web</Text>
        </TouchableOpacity>

      <Modal visible={createPatientModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear Paciente</Text>
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
            <Button title="Crear Paciente" onPress={handleCreatePatient} />
            <Button
              title="Cancelar"
              onPress={() => setCreatePatientModal(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>

      <Modal visible={createSpecialistModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear Especialista</Text>
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
            <Button
              title="Crear Especialista"
              onPress={handleCreateSpecialist}
            />
            <Button
              title="Cancelar"
              onPress={() => setCreateSpecialistModal(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Usuario</Text>
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
            <Button title="Guardar cambios" onPress={handleEditUser} />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="gray"
            />
            <Button
             title="Cerrar sesión"
             onPress={() => {
             navigation.navigate("Login");
             }}
             color="#d9534f"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  listContainer: {
    flex: 1,
  },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 15 },
  listItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  itemText: { fontSize: 16 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#46a7c6",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#E73F33",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 10,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  createPatientButton: {
    backgroundColor: "#46a7c6",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  createSpecialistButton: {
    backgroundColor: "#46a7c6",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
    viewWebButton: { 
        backgroundColor: '#4CAF50', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center', 
        marginTop: 20, 
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

export default AdminScreen;



