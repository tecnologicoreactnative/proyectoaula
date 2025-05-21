import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';



const HistoryScreen = (navigate) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Citas</Text>
      <TouchableOpacity
      >
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Aquí puedes ver el historial de tus citas.
        </Text>
        
      </TouchableOpacity>
    </View>
  );
}
export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});