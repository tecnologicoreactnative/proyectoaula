import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, Button } from 'react-native';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const AdminScreen = () => {
  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const patientsList = [];
      const specialistsList = [];

      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        const user = { id: docSnap.id, ...userData };
        if (user.role === 'paciente') patientsList.push(user);
        if (user.role === 'especialista') specialistsList.push(user);
      });

      setPatients(patientsList);
      setSpecialists(specialistsList);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleEditUser = async () => {
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        name: selectedUser.name,
        typedocument: selectedUser.typedocument,
        email: selectedUser.email,
        role: selectedUser.role,
      });
      setModalVisible(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error al editar usuario:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View>
        <Text style={styles.itemText}>Nombre: {item.name}</Text>
        <Text style={styles.itemText}>Tipo Documento: {item.typedocument}</Text>
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
      <FlatList data={patients} keyExtractor={(item) => item.id} renderItem={renderItem} />

      <Text style={styles.title}>Especialistas</Text>
      <FlatList data={specialists} keyExtractor={(item) => item.id} renderItem={renderItem} />

      {/* MODAL DE EDICIÓN */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Usuario</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={selectedUser?.name || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Tipo de documento"
            value={selectedUser?.typedocument || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, typedocument: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={selectedUser?.email || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Rol"
            value={selectedUser?.role || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, role: text })}
          />

          <View style={styles.modalButtons}>
            <Button title="Guardar cambios" onPress={handleEditUser} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
  listItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  itemText: { fontSize: 16 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 10,
  },
});

export default AdminScreen;
