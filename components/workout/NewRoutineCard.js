import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NewRoutineCard = () => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("NewRoutineScreen")}>
    <Ionicons name="reader-outline" size={32} color="#333" style={styles.icon} />
    <Text style={styles.title}>Empezar rutina</Text>
  </TouchableOpacity>
  );
};

export default NewRoutineCard;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      padding: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      width: 160,
      height: 60,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111',
    },
  });
