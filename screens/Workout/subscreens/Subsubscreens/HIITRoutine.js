import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoutinesContext } from "../../../../context/RoutinesContext";
import ExerciseCard from "../../../../components/workout/ExerciseCard";

const HIITRoutine = () => {
  const [routine, setRoutine] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const { loading, error, getRoutine, loadAllRoutines } = useRoutinesContext();

  // URLs de ejemplo para las imágenes de los ejercicios
  const exerciseImages = {
    ejercicio1: "https://www.elindependiente.com/wp-content/uploads/2024/05/captura-de-pantalla-2024-05-21-a-las-182231.png",
    ejercicio2: "https://s2.abcstatics.com/media/bienestar/2020/04/08/jumping-jack-2-k8hE--510x349@abc.jpeg",
    ejercicio3: "https://t3.ftcdn.net/jpg/04/85/26/50/360_F_485265082_XHMjXuKYEnxlI5ybgKr6rfAJSqR33WRA.jpg",
    ejercicio4: "https://static.vecteezy.com/system/resources/previews/008/635/521/non_2x/woman-doing-jump-squats-exercise-flat-illustration-isolated-on-white-background-vector.jpg",
    ejercicio5: "https://i.pinimg.com/564x/a2/e7/e2/a2e7e2fb70013dac2054b5e0c17bd5f6.jpg",
  };

  const countExercises = {
    burpees: [{ series: 8, reps: 10 }],
    saltostijera: [{ series: 8, reps: 10 }],
    mountainclimbers: [{ series: 8, reps: 10 }],
    sentadillassalto: [{ series: 8, reps: 10 }],
    planchadesplazamiento: [{ series: 8, reps: 10 }],
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        await loadAllRoutines();
        const routineData = await getRoutine("HIITRoutine");
        if (routineData) {
          setRoutine(routineData);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }).start();
        }
      } catch (err) {
        console.error("Error fetching routine:", err);
      }
    };
    fetchRoutine();
  }, []);

  const handleExercisePress = (exerciseKey) => {
    if (exerciseImages[exerciseKey]) {
      setCurrentImage(exerciseImages[exerciseKey]);
      setImageModalVisible(true);
    } else {
      console.log("No hay imagen disponible para este ejercicio");
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>⚠️ Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {routine ? (
          <Animated.View
            style={[styles.routineContainer, { opacity: fadeAnim }]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.routineName}>
                {routine.name || "Rutina HIIT"}
              </Text>
              <Text style={styles.routineDescription}>
                {routine.descripcion || "Descripción no disponible"}
              </Text>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={16} color="#3b82f6" />
                <Text style={styles.durationText}>
                  {routine.duration
                    ? `${routine.duration} mins`
                    : "Duración no especificada"}
                </Text>
              </View>
            </View>

            {/* Ejercicios */}
            <Text style={styles.sectionTitle}>Ejercicios</Text>

            <ExerciseCard
              icon="barbell"
              exerciseKey="ejercicio1"
              name={routine.ejercicio1}
              series={countExercises.burpees[0].series}
              reps={countExercises.burpees[0].reps}
              onPress={handleExercisePress}
            />

            <ExerciseCard
              icon="body"
              exerciseKey="ejercicio2"
              name={routine.ejercicio2}
              series={countExercises.saltostijera[0].series}
              reps={countExercises.saltostijera[0].reps}
              onPress={handleExercisePress}
            />

            <ExerciseCard
              icon="fitness"
              exerciseKey="ejercicio3"
              name={routine.ejercicio3}
              series={countExercises.mountainclimbers[0].series}
              reps={countExercises.mountainclimbers[0].reps}
              onPress={handleExercisePress}
            />

            <ExerciseCard
              icon="fitness"
              exerciseKey="ejercicio4"
              name={routine.ejercicio4}
              series={countExercises.sentadillassalto[0].series}
              reps={countExercises.sentadillassalto[0].reps}
              onPress={handleExercisePress}
            />

            <ExerciseCard
              icon="fitness"
              exerciseKey="ejercicio5"
              name={routine.ejercicio5}
              series={countExercises.planchadesplazamiento[0].series}
              reps={countExercises.planchadesplazamiento[0].reps}
              onPress={handleExercisePress}
            />

            {/* Botón de acción */}
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Comenzar Rutina</Text>
              <Ionicons name="play" size={18} color="white" />
            </TouchableOpacity>

            {/* Modal para visualizar imágenes */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={imageModalVisible}
              onRequestClose={() => setImageModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <Pressable
                  style={styles.modalBackground}
                  onPress={() => setImageModalVisible(false)}
                />
                <View style={styles.modalContent}>
                  <Image
                    source={{ uri: currentImage }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setImageModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </Pressable>
                </View>
              </View>
            </Modal>
          </Animated.View>
        ) : (
          <View style={styles.notFoundContainer}>
            <Ionicons name="sad-outline" size={40} color="#9ca3af" />
            <Text style={styles.notFoundText}>Rutina no encontrada</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: "90%",
  },
  loadingText: {
    color: "#e2e8f0",
    fontSize: 16,
  },
  routineContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 16,
  },
  routineName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },
  routineDescription: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1e3a8a20",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  durationText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
    maxWidth: "95%",
  },
  exerciseDetail: {
    fontSize: 13,
    color: "#94a3b8",
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  notFoundText: {
    color: "#9ca3af",
    fontSize: 18,
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
});

export default HIITRoutine;