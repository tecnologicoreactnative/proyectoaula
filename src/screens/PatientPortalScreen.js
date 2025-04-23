import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView, StyleSheet, Platform } from 'react-native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import { AuthContext } from '../context/AutenticacionContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const PatientPortalScreen = ({ navigation }) => {
    const [Name, setName] = useState('');
    const [FullName, setFullName] = useState('');
    const [Typedocument, setTypeDocument] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [Birthday, setBirthday] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [Genre, setGenre] = useState('');
    const [adress, setadress] = useState('');
    const [phone, setphone] = useState('');
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [cedulaRegistrada, setCedulaRegistrada] = useState(false);

    const { logOut, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const q = query(
                    collection(db, 'Patients'),
                    where('uid', '==', user?.uid)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setName(data.Name || '');
                    setFullName(data.FullName || '');
                    setTypeDocument(data.Typedocument || '');
                    setDocumentNumber(data.documentNumber || '');
                    setBirthday(data.Birthday ? new Date(data.Birthday) : new Date());
                    setGenre(data.Genre || '');
                    setadress(data.adress || '');
                    setphone(data.phone || '');
                    setEmail(data.email || '');
                    setIsFirstTime(false);
                    navigation.navigate('Agendamiento'); 
                } else {
                    setEmail(user?.email || '');
                    setIsFirstTime(true);
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                Alert.alert("Error", "No se pudieron cargar los datos del paciente.");
            } finally {
                setIsLoading(false);
            }
        };
        if (user?.uid) fetchPatient();
    }, [user, navigation]); // Dependencia 'navigation' añadida

    const verificarCedulaRegistrada = async (cedula) => {
        try {
            const q = query(
                collection(db, 'Patients'),
                where('Typedocument', '==', 'Cédula'),
                where('documentNumber', '==', cedula)
            );
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error al verificar la cédula:", error);
            return false;
        }
    };

    const handleSave = async () => {
        if (!Name || !FullName || !Typedocument || !documentNumber || !email) {
            Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (Typedocument === 'Cédula') {
            const isCedulaRegistrada = await verificarCedulaRegistrada(documentNumber);
            if (isCedulaRegistrada) {
                Alert.alert('Registro fallido', 'La cédula ya se encuentra registrada. Por favor, inicia sesión.');
                setCedulaRegistrada(true);
                return;
            }
        }

        try {
            await addDoc(collection(db, 'Patients'), {
                uid: user.uid,
                Name,
                FullName,
                Typedocument,
                documentNumber,
                Birthday: Birthday.toISOString(),
                Genre,
                adress,
                phone,
                email,
                regisdate: new Date().toISOString(),
            });
            Alert.alert('Registro exitoso', 'Tus datos se han guardado correctamente.', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Agendamiento'),
                },
            ]);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            Alert.alert("Error", "No se pudieron guardar los datos.");
        }
    };

    const onChangeBirthday = (event, selectedDate) => {
        const currentDate = selectedDate || Birthday;
        setShowDatePicker(Platform.OS === 'ios');
        setBirthday(currentDate);
    };


    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Información del Paciente</Text>
                <TextInput placeholder="Nombre *" value={Name} onChangeText={setName} editable={isFirstTime} style={styles.input} />
                <TextInput placeholder="Apellidos *" value={FullName} onChangeText={setFullName} editable={isFirstTime} style={styles.input} />
                {isFirstTime && (
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Tipo de documento:</Text>
                        <Picker
                            selectedValue={Typedocument}
                            style={styles.picker}
                            onValueChange={(itemValue) => setTypeDocument(itemValue)}
                        >
                            <Picker.Item label="Seleccionar" value="" />
                            <Picker.Item label="Cédula" value="Cédula" />
                            <Picker.Item label="Tarjeta de identidad" value="Tarjeta de identidad" />
                            <Picker.Item label="Permiso de permanencia" value="Permiso de permanencia" />
                        </Picker>
                    </View>
                )}
                <TextInput placeholder="Número de documento *" value={documentNumber} onChangeText={setDocumentNumber} editable={isFirstTime} style={styles.input} />
                {isFirstTime && (
                    <View>
                        <Text style={styles.label}>Fecha de nacimiento:</Text>
                        <Button title={Birthday.toLocaleDateString()} onPress={() => setShowDatePicker(true)} />
                        {showDatePicker && (
                            <DateTimePicker
                                value={Birthday}
                                mode="date"
                                display="default"
                                onChange={onChangeBirthday}
                            />
                        )}
                    </View>
                )}
                {isFirstTime && (
                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Género:</Text>
                        <Picker
                            selectedValue={Genre}
                            style={styles.picker}
                            onValueChange={(itemValue) => setGenre(itemValue)}
                        >
                            <Picker.Item label="Seleccionar" value="" />
                            <Picker.Item label="Masculino" value="Masculino" />
                            <Picker.Item label="Femenino" value="Femenino" />
                        </Picker>
                    </View>
                )}
                <TextInput placeholder="Dirección" value={adress} onChangeText={setadress} editable={isFirstTime} style={styles.input} />
                <TextInput placeholder="Teléfono" value={phone} onChangeText={setphone} editable={isFirstTime} style={styles.input} keyboardType="phone-pad" />
                <TextInput placeholder="Correo electrónico *" value={email} onChangeText={setEmail} editable={isFirstTime} style={styles.input} keyboardType="email-address" />
                {isFirstTime ? (
                    <Button title="Guardar Información" onPress={handleSave} disabled={cedulaRegistrada} />
                ) : (
                    <Text style={styles.welcome}>Bienvenido, {Name} {FullName}!</Text>
                )}
                {cedulaRegistrada && (
                    <Text style={styles.errorText}>La cédula ya está registrada. Por favor, inicia sesión.</Text>
                )}
                <Button title="Ir a la agenda" onPress={() => navigation.navigate('Agendamiento')} color="blue" />
                <Button title="Cerrar sesión" onPress={logOut} color="#d9534f" />
                <Button title="Cancelar/Reprogramar cita" onPress={() => navigation.navigate('Cancelacion_Reprogramacion')} color="#d9534f" />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    welcome: {
        marginBottom: 16,
        fontSize: 16,
        color: '#2c3e50',
    },
    pickerContainer: {
        marginBottom: 12,
        borderWidth: 0.5,
        borderRadius: 15,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default PatientPortalScreen;