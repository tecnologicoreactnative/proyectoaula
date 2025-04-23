// screens/AgendarScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import {
  Button,
  TextInput,
  Title,
  Card,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

const AgendarScreen = () => {
  const theme = useTheme();
  const BRAND = '#274b6a';

  const [profesionales, setProfesionales]               = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [horarios, setHorarios]                         = useState([]);
  const [selectedHorario, setSelectedHorario]           = useState('');
  const [observaciones, setObservaciones]               = useState('');
  const [selectedDate, setSelectedDate]                 = useState(new Date());
  const [openDatePicker, setOpenDatePicker]             = useState(false);

  // Carga de profesionales
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'profesional'));
        setProfesionales(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        Alert.alert('Error', 'No se pudo cargar profesionales.');
      }
    })();
  }, []);

  // Carga de horarios
  useEffect(() => {
    if (!selectedProfessional) {
      setHorarios([]);
      setSelectedHorario('');
      return;
    }
    (async () => {
      try {
        const q = query(
          collection(db, 'horarios'),
          where('id_profesional', '==', selectedProfessional),
          where('estado', '==', false)
        );
        const snap = await getDocs(q);
        setHorarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        Alert.alert('Error', 'No se pudo cargar horarios.');
      }
    })();
  }, [selectedProfessional]);

  // DatePicker handlers
  const onDismissDate = () => setOpenDatePicker(false);
  const onConfirmDate = ({ date }) => {
    setOpenDatePicker(false);
    setSelectedDate(date);
  };

  // Envío del formulario
  const handleSubmit = async () => {
    if (!selectedProfessional || !selectedHorario) {
      return Alert.alert('Error', 'Selecciona profesional y horario.');
    }
    const user = auth.currentUser;
    if (!user) {
      return Alert.alert('Error', 'Usuario no autenticado.');
    }
    const horario = horarios.find(h => h.id === selectedHorario);
    if (!horario) {
      return Alert.alert('Error', 'Horario inválido.');
    }

    try {
      // Crear cita
      await addDoc(collection(db, 'citas'), {
        pacienteId:     user.uid,
        profesionalId:  selectedProfessional,
        horarioId:      selectedHorario,     // <-- ID del horario
        fecha_hora:     `${horario.fecha} ${horario.hora}`,
        duracion:       horario.duracion,
        estado:         'pendiente',
        observaciones,
        creadoEn:       new Date(),
      });
      // Marcar horario ocupado
      await updateDoc(doc(db, 'horarios', selectedHorario), { estado: true });

      Alert.alert('¡Éxito!', 'Cita solicitada.');
      // Reset
      setSelectedProfessional(null);
      setHorarios([]);
      setSelectedHorario('');
      setObservaciones('');
      setSelectedDate(new Date());
    } catch {
      Alert.alert('Error', 'No se pudo solicitar la cita.');
    }
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      <Title style={styles.header}>Solicitar Nueva Cita</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>Profesional</Paragraph>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedProfessional}
              onValueChange={setSelectedProfessional}
              style={Platform.OS === 'ios' ? styles.pickerIOS : {}}
            >
              <Picker.Item label="— Selecciona —" value={null} />
              {profesionales.map(p => (
                <Picker.Item
                  key={p.id}
                  label={`${p.nombre} ${p.apellidos}`}
                  value={p.id_profesional}
                />
              ))}
            </Picker>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>Horario</Paragraph>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedHorario}
              onValueChange={setSelectedHorario}
              style={Platform.OS === 'ios' ? styles.pickerIOS : {}}
            >
              <Picker.Item label="— Selecciona —" value="" />
              {horarios.map(h => (
                <Picker.Item
                  key={h.id}
                  label={`${h.fecha} • ${h.hora}`}
                  value={h.id}
                />
              ))}
            </Picker>
          </View>
        </Card.Content>
      </Card>


      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.label}>Observaciones</Paragraph>
          <TextInput
            mode="flat"
            placeholder="Escribe aquí..."
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            numberOfLines={4}
            style={styles.input}
            underlineColor="transparent"
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        contentStyle={styles.btnContent}
        style={[styles.submitBtn, { backgroundColor: BRAND }]}
      >
        Enviar Solicitud
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f5f7fa',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#274b6a',
    fontSize: 22,
    fontWeight: '700',
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerIOS: {
    height: 150,
  },
  dateBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  submitBtn: {
    marginTop: 20,
    borderRadius: 8,
  },
  btnContent: {
    paddingVertical: 8,
  },
});

export default AgendarScreen;
