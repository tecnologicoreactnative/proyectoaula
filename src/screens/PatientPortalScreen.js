// screens/PatientPortalScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AutenticacionContext';
import { Card } from 'react-native-paper';

const { width } = Dimensions.get('window');
// Volvemos al azul original utilizado anteriormente
const BRAND_BLUE = '#274b6a';

const PatientPortalScreen = () => {
  const [userName, setUserName]       = useState('');
  const [citas, setCitas]             = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading]         = useState(true);
  const { logOut }                    = useContext(AuthContext);
  const isFocused                     = useIsFocused();

  // 1) Cargar nombre del usuario para el saludo
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, 'usuarios', user.uid))
      .then(snap => {
        if (snap.exists()) {
          const { nombre, apellidos } = snap.data();
          setUserName(`${nombre} ${apellidos}`);
        } else {
          setUserName('Paciente');
        }
      })
      .catch(e => console.error('Error cargando perfil:', e));
  }, []);

  // 2) Cargar citas y marcar fechas
  const loadCitas = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');
      const q = query(
        collection(db, 'citas'),
        where('pacienteId', '==', user.uid)
      );
      const snap = await getDocs(q);
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCitas(lista);

      // Preparar marcado de fechas
      const marks = {};
      lista.forEach(cita => {
        const day = cita.fecha_hora.split(' ')[0]; // "YYYY-MM-DD"
        marks[day] = {
          marked: true,
          dotColor: BRAND_BLUE,
          activeOpacity: 0,
        };
      });
      setMarkedDates(marks);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) loadCitas();
  }, [isFocused, loadCitas]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: BRAND_BLUE }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const citasHoy = selectedDay
    ? citas.filter(c => c.fecha_hora.startsWith(selectedDay))
    : [];

  return (
    <View style={styles.container}>
      {/* Header curvado y moderno */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Bienvenido,{' '}
          <Text style={styles.userName}>{userName}</Text>
        </Text>
      </View>

      {/* Calendario con puntos azules */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => setSelectedDay(day.dateString)}
          markedDates={{
            ...markedDates,
            ...(selectedDay
              ? { [selectedDay]: { selected: true, selectedColor: BRAND_BLUE } }
              : {}),
          }}
          theme={{
            backgroundColor: '#fff',
            calendarBackground: '#fff',
            textSectionTitleColor: '#666',
            selectedDayTextColor: '#fff',
            todayTextColor: BRAND_BLUE,
            dayTextColor: '#333',
            arrowColor: BRAND_BLUE,
            monthTextColor: BRAND_BLUE,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Lista de citas para el día */}
      {selectedDay && (
        <View style={styles.listWrapper}>
          <Text style={styles.subTitle}>
            Citas del {selectedDay}
          </Text>

          {citasHoy.length === 0 ? (
            <Text style={styles.empty}>No tienes citas este día</Text>
          ) : (
            <FlatList
              data={citasHoy}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Content style={styles.cardContent}>
                    <View>
                      <Text style={styles.time}>
                        {item.fecha_hora.split(' ')[1]}
                      </Text>
                      <Text style={styles.status}>
                        {item.estado.toUpperCase()}
                      </Text>
                    </View>
                    {item.observaciones ? (
                      <Text style={styles.obs}>
                        {item.observaciones}
                      </Text>
                    ) : null}
                  </Card.Content>
                </Card>
              )}
            />
          )}
        </View>
      )}

      {/* Logout */}
      <Text onPress={logOut} style={styles.logout}>
        Cerrar sesión
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f7fa' },
  center:         {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header:         {
    backgroundColor: BRAND_BLUE,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting:       { color: '#fff', fontSize: 22, fontWeight: '600' },
  userName:       { color: '#fff', fontSize: 22, fontWeight: '700' },
  calendarContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  listWrapper:    { flex: 1, marginTop: 12, marginHorizontal: 16 },
  subTitle:       {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  card:           {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardContent:    {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time:           { fontSize: 16, fontWeight: '600', color: BRAND_BLUE },
  status:         { fontSize: 14, color: '#555', marginTop: 4 },
  obs:            { fontSize: 12, color: '#777', marginTop: 4, flex: 1, textAlign: 'right' },
  empty:          { textAlign: 'center', color: '#999', marginTop: 20 },
  logout:         {
    textAlign: 'center',
    padding: 16,
    color: '#d9534f',
    fontWeight: '600',
  },
});

export default PatientPortalScreen;
