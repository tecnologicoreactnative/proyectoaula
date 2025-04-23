import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoutinesContext } from "../../../../context/RoutinesContext";

const FullBodyRoutine = () => {
  const { routines, getRoutine, loading } = useRoutinesContext();
  const [routineDetails, setRoutineDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFullBodyRoutine = async () => {
      try {
        const fullBodyRoutine = routines.find(
          (r) =>
            r.name.toLowerCase() === "fullbodyroutine" ||
            r.name.toLowerCase() === "full body routine"
        );
        if (fullBodyRoutine) {
          const details = await getRoutine(fullBodyRoutine.id);
          setRoutineDetails(details);
        } else {
          setError("No se encontró la rutina Full Body");
        }
      } catch (err) {
        setError("Error al cargar la rutina");
        console.error(err);
      }
    };

    loadFullBodyRoutine();
  }, [routines]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!routineDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No se encontraron detalles de la rutina</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{routineDetails.name}</Text>
        <Text style={styles.subtitle}>
          Dificultad: {routineDetails.difficulty}
        </Text>
        <Text style={styles.duration}>
          Duración: {routineDetails.duration} minutos
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{routineDetails.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ejercicios</Text>
        {routineDetails.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseDetails}>
              <Text>Series: {exercise.sets}</Text>
              <Text>Repeticiones: {exercise.reps}</Text>
              <Text>Descanso: {exercise.rest} seg</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  duration: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  exerciseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});

export default FullBodyRoutine;
