import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, addDoc, deleteDoc, getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { AuthContext } from '../context/AutenticacionContext';

const Citas = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [disponibles, setDisponibles] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const cargarDisponibilidad = async () => {
            const snapshot = await getDocs(collection(db, 'disponibilidad'));
            const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDisponibles(datos);
        };
        cargarDisponibilidad();
    }, []);

    const agendarCita = async (disponibilidad) => {
        try {
           
            const citaRef = await addDoc(collection(db, 'citas'), {
                fecha: disponibilidad.fecha,
                hora: disponibilidad.hora,
                id_especialista: disponibilidad.id_especialista,
                id_paciente: user.uid,
                nombre_paciente: user.name,
                nombre_especialista: disponibilidad.nombre_especialista || '', 
                estado: 'agendada'
            });

            const citaId = citaRef.id;

            // 2. Agregar la cita al array de citas del paciente
            const pacienteRef = doc(db, 'users', user.uid);
            await updateDoc(pacienteRef, {
                citas: arrayUnion(citaId)
            });

            // 3. Agregar la cita al array de citas del especialista
            const especialistaRef = doc(db, 'users', disponibilidad.id_especialista);
            await updateDoc(especialistaRef, {
                citas: arrayUnion(citaId)
            });

            // 4. Eliminar la disponibilidad seleccionada
            await deleteDoc(doc(db, 'disponibilidad', disponibilidad.id));

            Alert.alert('Cita agendada con éxito');
            navigation.navigate('PatientPortalScreen');

        } catch (error) {
            console.error(error);
            Alert.alert('Error al agendar cita');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Horarios Disponibles</Text>
            {disponibles.map((disp, index) => (
                <TouchableOpacity
                    key={disp.id}
                    style={styles.dispoItem}
                    onPress={() => agendarCita(disp)}
                >
                    <Text>📅 {disp.fecha} ⏰ {disp.hora}</Text>
                    <Text>Especialista: {disp.nombre_especialista || disp.id_especialista}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default Citas;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    dispoItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
