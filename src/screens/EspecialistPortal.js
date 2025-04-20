import React, { useState, useEffect, useContext } from 'react'; 
import { View, TextInput, Button, Text, Alert, ScrollView } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDatabase, ref, set, get } from 'firebase/database';
import { AuthContext } from '../context/AutenticacionContext'; 

const EspecialistPortal = () => {
  const [Name, setName] = useState('');
  const [Fullname, setFullName] = useState('');
  const [specialty, setspecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setemail] = useState('');
  const [regisdate, setregisdate] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true); 
  const [isLoading, setIsLoading] = useState(true);

  const { logOut } = useContext(AuthContext);

  useEffect(() => {
    const especialistId = auth.currentUser?.eid;
    const db = getDatabase();
    const especialistRef = ref(db, 'especialist/' + especialistId);

    get(especialistRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFullName(data.fullName);
          setPhone(data.phone);
          setIsFirstTime(false);
        } else {
          setIsFirstTime(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos: ", error);
        Alert.alert("Error", "No se pudieron cargar los datos.");
        setIsLoading(false);
      });
  }, []);

  const handleSave = () => {
    const especialistId = auth.currentUser?.uid;
    const db = getDatabase();
    set(ref(db, 'especialist/' + especialistId), {
      fullName: Fullname,
      phone,
      name: Name,
      typeDocument: Typedocument,
      birthday: Birthday,
      genre: Genre,
      address: adress,
      email,
      password,
      regisdate,
    })
      .then(() => { 
        Alert.alert('Registro exitoso'); 
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Error al guardar los datos: ", error);
        Alert.alert("Error", "No se pudieron guardar los datos.");
      });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Información del Especialista</Text>

      <TextInput placeholder="Nombre" value={Name} onChangeText={setName} editable={isFirstTime} style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Apellidos" value={Fullname} onChangeText={setFullName} editable={isFirstTime} style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Especialidad" value={specialty} onChangeText={setspecialty} editable={isFirstTime} style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Teléfono" value={phone} onChangeText={setPhone} editable={isFirstTime} style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Correo electrónico" value={email} onChangeText={setemail} editable={isFirstTime} style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />
      {isFirstTime ? (
        <Button title="Guardar Información" onPress={handleSave} />
      ) : (
        <Text style={{ marginBottom: 16 }}>Bienvenido de nuevo, {Fullname}!</Text>
      )}

      <Button title="Volver" onPress={() => navigation.navigate('Inicio')} color="#5bc0de" />
      <Button title="Ir a la agenda" onPress={() => navigation.navigate('Agendamiento')} color="blue" />
      <Button title="Cerrar sesión" onPress={logOut} color="#d9534f" />
    </ScrollView>
  );
};

export default EspecialistPortal;

  
  
  

