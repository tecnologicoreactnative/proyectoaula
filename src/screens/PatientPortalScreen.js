import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDatabase, ref, set, get } from 'firebase/database';
import { AuthContext } from '../context/AutenticacionContext'; 

const PatientPortalScreen = ({navigation}) => {
  const [Name, setName] = useState('');
  const [Fullname, setFullName] = useState('');
  const [Typedocument, setTypeDocument] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [Birthday, setBirthday] = useState('');
  const [Genre, setGenre] = useState('');
  const [adress, setadress] = useState('');
  const [phone, setphone] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [regisdate, setregisdate] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); 
  const [isLoading, setIsLoading] = useState(true);

  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    const patienteId = auth.currentUser.patienteId; 
    const db = getDatabase();
    const patientRef = ref(db, 'patients/' + patienteId);

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
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Información del Paciente</Text>
      
      <TextInput
        placeholder="Nombre"
        value={Name}
        onChangeText={setName}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Apellidos"
        value={Fullname}
        onChangeText={setFullName}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Tipo documento"
        value={Typedocument}
        onChangeText={setTypeDocument}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Fecha de nacimiento"
        value={Birthday}
        onChangeText={setBirthday}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Genero"
        value={Genre}
        onChangeText={setGenre}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Dirección"
        value={adress}
        onChangeText={setadress}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setphone}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Correo electronico"
        value={email}
        onChangeText={setemail}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setpassword}
        editable={isFirstTime}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Fecha registro"
        value={regisdate}
        onChangeText={setregisdate}
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
    </View>
     
  );
  
};

export default PatientPortalScreen;
