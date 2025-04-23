import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { AuthContext } from '../context/AutenticacionContext';

const EspecialistPortal = ({ navigation }) => {
    const [Name, setName] = useState('');
    const [FullName, setFullName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [regisdate, setRegisdate] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [emailExists, setEmailExists] = useState(false);
    const [cedula, setCedula] = useState('');
    const [cedulaExists, setCedulaExists] = useState(false);

    const { logOut, user } = useContext(AuthContext);

    useEffect(() => {
        const especialistaId = user?.uid;
        const db = getDatabase();
        const especialistaRef = ref(db, 'EspecialistPortal/' + especialistaId);

        if (especialistaId) {
            get(especialistaRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setFullName(data.FullName || '');
                        setPhone(data.phone || '');
                        setSpecialty(data.specialty || '');
                        setEmail(data.email || '');
                        setCedula(data.cedula || '');
                        setIsFirstTime(false);
                    } else {
                        setIsFirstTime(true);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos: ", error);
                    Alert.alert("Error", "No se pudieron cargar los datos del especialista.");
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const verificarEmailExistente = async (emailToCheck) => {
        const db = getDatabase();
        const especialistsRef = ref(db, 'EspecialistPortal');
        const emailQuery = query(especialistsRef, orderByChild('email'), equalTo(emailToCheck));
        const snapshot = await get(emailQuery);
        return snapshot.exists();
    };

    const verificarCedulaExistente = async (cedulaToCheck) => {
        const db = getDatabase();
        const especialistsRef = ref(db, 'EspecialistPortal');
        const cedulaQuery = query(especialistsRef, orderByChild('cedula'), equalTo(cedulaToCheck));
        const snapshot = await get(cedulaQuery);
        return snapshot.exists();
    };

    const handleSave = async () => {
        if (!Name || !FullName || !specialty || !phone || !email || !cedula) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        const isEmailTaken = await verificarEmailExistente(email);
        if (isEmailTaken) {
            Alert.alert('Error', 'Este correo electrónico ya está registrado. Por favor, ingrese otro o inicie sesión.');
            setEmailExists(true);
            return;
        }

        const isCedulaTaken = await verificarCedulaExistente(cedula);
        if (isCedulaTaken) {
            Alert.alert('Error', 'Esta cédula ya está registrada. Por favor, ingrese otra o inicie sesión.');
            setCedulaExists(true);
            return;
        }

        const especialistaId = user?.uid;
        const db = getDatabase();
        set(ref(db, 'EspecialistPortal/' + especialistaId), {
            FullName: FullName,
            phone: phone,
            Name: Name,
            specialty: specialty,
            email: email,
            cedula: cedula,
            regisdate: new Date().toISOString(),
        })
            .then(() => {
                Alert.alert('Registro exitoso');
                navigation.navigate('Inicio');
            })
            .catch((error) => {
                console.error("Error al guardar los datos: ", error);
                Alert.alert("Error", "No se pudieron guardar los datos.");
            });
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ fontSize: 20, marginBottom: 16 }}>Información del Especialista</Text>

            <TextInput
                placeholder="Nombre"
                value={Name}
                onChangeText={setName}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Apellidos"
                value={FullName}
                onChangeText={setFullName}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Especialidad"
                value={specialty}
                onChangeText={setSpecialty}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Teléfono"
                value={phone}
                onChangeText={setPhone}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
                keyboardType="email-address"
            />
            {emailExists && (
                <Text style={{ color: 'red', marginBottom: 10 }}>Este correo electrónico ya está registrado.</Text>
            )}
            <TextInput
                placeholder="Cédula"
                value={cedula}
                onChangeText={setCedula}
                editable={isFirstTime}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
                keyboardType="numeric"
            />
            {cedulaExists && (
                <Text style={{ color: 'red', marginBottom: 10 }}>Esta cédula ya está registrada.</Text>
            )}

            {isFirstTime ? (
                <Button title="Guardar Información" onPress={handleSave} />
            ) : (
                <Text style={{ marginBottom: 16 }}>Bienvenido de nuevo, {FullName}!</Text>
            )}

            <Button title="Volver" onPress={() => navigation.navigate('Inicio')} color="#5bc0de" />
            <Button title="Ir a la agenda" onPress={() => navigation.navigate('Agendamiento')} color="blue" />
            <Button title="Cerrar sesión" onPress={logOut} color="#d9534f" />
        </ScrollView>
    );
};

export default EspecialistPortal;
  
  
  

