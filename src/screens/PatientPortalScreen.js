import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDatabase, ref, set, get } from 'firebase/database';
import { AuthContext } from '../context/AutenticacionContext'; 

const PatientPortalScreen = () => {
  const [fullName, setFullName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); 
  const [isLoading, setIsLoading] = useState(true);

  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    const userId = auth.currentUser.uid; 
    const db = getDatabase();
    const patientRef = ref(db, 'patients/' + userId);

    get(patientRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const patientData = snapshot.val();
          setFullName(patientData.fullName);
          setPhone(patientData.phone);
          setIsFirstTime(false);
        } else {
          setIsFirstTime(true);
        }
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error("Error al obtener los datos: ", error);
        Alert.alert("Error", "No se pudieron cargar los datos del paciente.");
        setIsLoading(false);
      });
  }, []);

  const handleSave = () => {
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    set(ref(db, 'patients/' + userId), {
      fullName,
      phone,
    })
      .then(() => {
        Alert.alert("Éxito", "Información guardada correctamente.");
      })
      .catch((error) => {
        console.error("Error al guardar los datos: ", error);
        Alert.alert("Error", "No se pudieron guardar los datos.");
      });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Información del Paciente</Text>
      
      <TextInput
        placeholder="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      
      {isFirstTime ? (
        <Button title="Guardar Información" onPress={handleSave} />
      ) : (
        <Text style={{ marginBottom: 16 }}>Bienvenido de nuevo, {fullName}!</Text>
      )}

      <Button title="Cerrar sesión" onPress={logOut} color="#d9534f" />
    </View>
  );
};

export default PatientPortalScreen;
