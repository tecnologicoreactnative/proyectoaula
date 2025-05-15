import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoutinesContext } from "../../../../context/RoutinesContext";

const FullBodyRoutine = () => {
  const [routine, setRoutine] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { loading, error, getRoutine, loadAllRoutines } = useRoutinesContext();

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        await loadAllRoutines();
        const routineData = await getRoutine("FullBodyRoutine");
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
          <Animated.View style={[styles.routineContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.routineName}>{routine.name || "Rutina Full Body"}</Text>
              <Text style={styles.routineDescription}>
                {routine.descripcion || "Descripción no disponible"}
              </Text>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={16} color="#3b82f6" />
                <Text style={styles.durationText}>
                  {routine.duration ? `${routine.duration} mins` : "Duración no especificada"}
                </Text>
              </View>
            </View>

            {/* Ejercicios */}
            <Text style={styles.sectionTitle}>Ejercicios</Text>
            
            {/* TouchableOpacity 1 */}
            <TouchableOpacity
              style={styles.exerciseCard}
              activeOpacity={0.7}
              onPress={() => console.log("Ejercicio 1 presionado")}
            >
              <View style={styles.exerciseHeader}>
                <Ionicons name="barbell" size={20} color="#3b82f6" />
                <Text style={styles.exerciseName}>
                  {routine.ejercicio1 || "Ejercicio 1 no especificado"}
                </Text>
              </View>
              <Text style={styles.exerciseDetail}>4 series x 12 repeticiones</Text>
            </TouchableOpacity>

            {/* TouchableOpacity 2 */}
            <TouchableOpacity
              style={styles.exerciseCard}
              activeOpacity={0.7}
              onPress={() => console.log("Ejercicio 2 presionado")}
            >
              <View style={styles.exerciseHeader}>
                <Ionicons name="body" size={20} color="#3b82f6" />
                <Text style={styles.exerciseName}>
                  {routine.ejercicio2 || "Ejercicio 2 no especificado"}
                </Text>
              </View>
              <Text style={styles.exerciseDetail}>3 series x 10 repeticiones</Text>
            </TouchableOpacity>

            {/* TouchableOpacity 3 */}
            <TouchableOpacity
              style={styles.exerciseCard}
              activeOpacity={0.7}
              onPress={() => console.log("Ejercicio 3 presionado")}
            >
              <View style={styles.exerciseHeader}>
                <Ionicons name="fitness" size={20} color="#3b82f6" />
                <Text style={styles.exerciseName}>
                  {routine.ejercicio3 || "Ejercicio 3 no especificado"}
                </Text>
              </View>
              <Text style={styles.exerciseDetail}>3 series x 15 repeticiones</Text>
            </TouchableOpacity>

            {/* Botón de acción */}
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Comenzar Rutina</Text>
              <Ionicons name="play" size={18} color="white" />
            </TouchableOpacity>
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
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    backgroundColor: "#0f172a",
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // Asegura que el contenido del Scroll esté centrado
    width: "100%", // Ocupa todo el ancho disponible
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#0f172a", // Fondo oscuro elegante
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#e2e8f0",
    fontSize: 16,
  },
  routineContainer: {
    backgroundColor: "#1e293b", // Tarjetas oscuras con contraste
    borderRadius: 16,
    padding: 20,
    shadowColor: "#3b82f6", // Sombra azul neon
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
});

export default FullBodyRoutine;