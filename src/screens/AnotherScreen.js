import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnotherScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Otra Pantalla</Text>
      <Text style={styles.subtitle}>
        Aquí puedes agregar el contenido de tu segunda sección.

        djsdosjdojsods
        dsdishd
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666'
  }
});

export default AnotherScreen;
