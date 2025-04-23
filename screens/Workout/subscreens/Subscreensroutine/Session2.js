import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Session2 = () => {
  const navigation = useNavigation();
  const [completedExercises, setCompletedExercises] = useState([]);
  
  const exercises = [
    { 
      id: 1, 
      title: "Dominadas", 
      icon: "weight-lifter", 
      color: "#19194d",
      sets: 3,
      reps: 8
    },
    { 
      id: 2, 
      title: "Press Militar", 
      icon: "weight", 
      color: "#19194d",
      sets: 3,
      reps: 10
    },
    { 
      id: 3, 
      title: "Curl de Bíceps", 
      icon: "dumbbell", 
      color: "#19194d",
      sets: 3,
      reps: 12
    },
    { 
      id: 4, 
      title: "Extensiones de Tríceps", 
      icon: "weight-lifter", 
      color: "#19194d",
      sets: 3,
      reps: 12
    },
  ];

  const handleExercisePress = (exerciseId) => {
    setCompletedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };
  
  return (
    <View style={styles.container}>
      {exercises.map((exercise) => (
        <TouchableOpacity
          key={exercise.id}
          style={[
            styles.card, 
            { 
              backgroundColor: completedExercises.includes(exercise.id) ? "#4CAF50" : exercise.color 
            }
          ]}
          onPress={() => handleExercisePress(exercise.id)}
        >
          <Icon name={exercise.icon} size={30} color="white" style={styles.icon} />
          <View style={styles.exerciseInfo}>
            <Text style={styles.cardText}>{exercise.title}</Text>
            <Text style={styles.setsReps}>{exercise.sets} series x {exercise.reps} repeticiones</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Session2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
    marginTop: 50, 
    justifyContent: "center",
  },
  card: {
    width: "90%", 
    height: 80, 
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  exerciseInfo: {
    marginLeft: 15,
  },
  cardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  setsReps: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
  },
  icon: {
    marginRight: 10,
  },
});
