// screens/ListarCitasScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import {
  Portal,
  Dialog,
  Button as PaperButton,
  Paragraph as PaperParagraph,
} from 'react-native-paper';

const ListarCitasScreen = () => {
  const [citas, setCitas] = useState([]);
  const [profesionalesMap, setProfesionalesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [toCancel, setToCancel] = useState(null);
  const isFocused = useIsFocused();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      // 1) Cargar profesionales
      const profSnap = await getDocs(collection(db, 'profesional'));
      const profMap = {};
      profSnap.docs.forEach(d => {
        const data = d.data();
        profMap[data.id_profesional] = `${data.nombre} ${data.apellidos}`;
      });
      setProfesionalesMap(profMap);

      // 2) Cargar citas del paciente
      const q = query(
        collection(db, 'citas'),
        where('pacienteId', '==', user.uid)
      );
      const citaSnap = await getDocs(q);
      setCitas(citaSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error cargando citas:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused, loadData]);

  const confirmCancel = cita => {
    setToCancel(cita);
    setDialogVisible(true);
  };

  const handleCancel = async () => {
    if (!toCancel) return;
    try {
      // 1) Marcamos la cita como cancelada
      await updateDoc(doc(db, 'citas', toCancel.id), { estado: 'cancelado' });

      // 2) Liberamos el horario vinculado
      // Asegúrate de que toCancel.horarioId exista en tu documento de cita
      if (toCancel.horarioId) {
        await updateDoc(doc(db, 'horarios', toCancel.horarioId), {
          estado: false,
        });
      }

      setDialogVisible(false);
      setToCancel(null);
      loadData();
    } catch (e) {
      console.error('Error cancelando cita:', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#274b6a" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const doctor = profesionalesMap[item.profesionalId] || 'Desconocido';
    let badgeColor = '#006699';
    if (item.estado === 'pendiente') badgeColor = '#cccccc';
    if (item.estado === 'cancelado') badgeColor = '#d9534f';

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.date}>{item.fecha_hora}</Text>
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{item.estado}</Text>
          </View>
        </View>
        <Text style={styles.doctor}>Médico: {doctor}</Text>
        {item.observaciones ? (
          <Text style={styles.obs}>Obs: {item.observaciones}</Text>
        ) : null}
        {item.estado === 'pendiente' && (
          <TouchableOpacity
            onPress={() => confirmCancel(item)}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>Cancelar cita</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={citas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes citas programadas.</Text>
        }
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title style={styles.dialogTitle}>Confirmar</Dialog.Title>
          <Dialog.Content>
            <PaperParagraph>
              ¿Estás seguro que deseas cancelar esta cita?
            </PaperParagraph>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setDialogVisible(false)}>
              No
            </PaperButton>
            <PaperButton onPress={handleCancel} color="#d9534f">
              Sí, cancelar
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#274b6a',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  doctor: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  obs: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  cancelBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d9534f',
  },
  cancelText: {
    color: '#d9534f',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999999',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ListarCitasScreen;
