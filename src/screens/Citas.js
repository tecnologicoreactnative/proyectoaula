import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert,ScrollView } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDatabase, ref, set, get } from 'firebase/database';
import { AuthContext } from '../context/AutenticacionContext'; 

const Citas = ({navigation}) => {
  const [id_Appointment, setid_Appointment] = useState('');
  const [id_Patient, setid_Patient] = useState('');
  const [id_Professional, setid_Professional] = useState('');
  const [Professional, setProfessional] = useState('');
  const [date_Time, setdate_Time] = useState('');
  const [estimated_Duration, setestimated_Duration] = useState('');
  const [id_Resource, setid_Resource] = useState('');
  const [Status, setStatus,] = useState('');
  const [patient_Notes, setpatient_Notes,] = useState('');
  const [specialist_Notes, setspecialist_Notes] = useState('');
  const [creation_Date, setcreation_Date] = useState('');
  const [update_Date, setupdate_Date] = useState(''); 
  const [id_Sede, setid_Sede] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true);



  const { logOut } = useContext(AuthContext);
  
  useEffect(() => {
    if (!id_Appointment) return;
    const db = getDatabase();
    const appointmentRef = ref(db, 'appointment/' + id_Appointment);


    get(appointmentRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const Data = snapshot.val();
        setid_Patient(Data.id_Patient);
        setid_Professional(Data.id_Professional);
        setProfessional(Data.Professional);
        setdate_Time(Data.date_Time);
        setestimated_Duration(Data.estimated_Duration);
        setid_Resource(Data.id_Resource);
        setStatus(Data.Status);
        setpatient_Notes(Data.patient_Notes);
        setspecialist_Notes(Data.specialist_Notes);
        setcreation_Date(Data.creation_Date);
        setupdate_Date(Data.update_Date);
        setid_Sede(Data.id_Sede);
        setIsFirstTime(false);
      } else {
        setIsFirstTime(true);
      }
      setIsLoading(false);
    })


    .catch((error) => {
      console.error("Error al obtener los datos: ", error);
      Alert.alert("Error", "No se pudieron cargar los datos de la cita.");
    });
}, [id_Appointment]);

const handleSave = () => {
    const appointmentId = id_Appointment;
    const db = getDatabase();
    set(ref(db, 'appointment/' + appointmentId), {
      id_Appointment,
      id_Patient,
      id_Professional,
      Professional,
      date_Time,
      estimated_Duration,
      id_Resource,
      Status,
      patient_Notes,
      specialist_Notes,
      creation_Date,
      update_Date,
      id_Sede,
    })

    .then(() => { 
      console.log('Registro exitoso');
      Alert.alert('Registro exitoso'); 
      navigation.navigate('Login');
  })
  .catch((error) => {
      console.error("Error al guardar los datos: ", error);
      Alert.alert("Error", "No se pudieron guardar los datos.");
  });
  };


  return (
  
    <View style={{ padding: 16 }}>
      <ScrollView>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Registro de la cita</Text>
      
      <TextInput
        placeholder="id_Cita"
        value={id_Appointment}
        onChangeText={setid_Appointment}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="id_Paciente"
        value={id_Patient}
        onChangeText={setid_Patient}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="id_Profesionales"
        value={id_Professional}
        onChangeText={setid_Professional}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Profesional"
        value={Professional}
        onChangeText={setProfessional}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Fecha_Hora"
        value={date_Time}
        onChangeText={setdate_Time}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Duracion_Estimada"
        value={estimated_Duration}
        onChangeText={setestimated_Duration}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Id_Recurso"
        value={id_Resource}
        onChangeText={setid_Resource}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Estado"
        value={Status}
        onChangeText={setStatus}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Notas_Paciente"
        value={patient_Notes}
        onChangeText={setpatient_Notes}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Notas_Especialista"
        value={specialist_Notes}
        onChangeText={setspecialist_Notes}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Fecha_Creacion"
        value={creation_Date}
        onChangeText={setcreation_Date}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Fecha_Actualizacion"
        value={update_Date}
        onChangeText={setupdate_Date}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />


      <TextInput
        placeholder="Id_Sede"
        value={id_Sede}
        onChangeText={setid_Sede}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />


      {isFirstTime ? (
        <Button title="Guardar Información" onPress={handleSave} />
      ) : (
        <Text style={{ marginBottom: 16 }}>Bienvenido de nuevo, {fullName}!</Text>
      )}   
     <Button title="Volver" onPress={() => navigation.navigate('Inicio')} color="#5bc0de" />
      <Button title="Ir a la agenda" onPress={() => navigation.navigate('Agendamiento')} color="blue" />
      <Button title="Cerrar sesión" onPress={logOut} color="#d9534f" />
      </ScrollView>
    </View>
     
  );
  
};

export default Citas;

