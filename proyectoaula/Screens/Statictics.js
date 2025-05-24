import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Statictics = () => {
  const [properties, setProperties] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [rentedCount, setRentedCount] = useState(0);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await AsyncStorage.getItem("inmuebles");
        if (data) {
          const parsed = JSON.parse(data);
          setProperties(parsed);

          let views = 0, vendidos = 0, arrendados = 0;
          parsed.forEach((p) => {
            views += p.views || 0;
            if (p.estado === "vendido") vendidos++;
            if (p.estado === "arrendado") arrendados++;
          });

          setTotalViews(views);
          setSoldCount(vendidos);
          setRentedCount(arrendados);
        }
      } catch (error) {
        console.log("Error cargando propiedades:", error);
      }
    };

    loadProperties();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 Estadísticas de tus Inmuebles</Text>

      <View style={styles.card}>
        <Text style={styles.label}>👁️ Total de Vistas:</Text>
        <Text style={styles.value}>{totalViews}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🏠 Inmuebles Vendidos:</Text>
        <Text style={styles.value}>{soldCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📄 Inmuebles Arrendados:</Text>
        <Text style={styles.value}>{rentedCount}</Text>
      </View>

      <Text style={[styles.header, { fontSize: 18, marginTop: 30 }]}>Detalles por Inmueble</Text>
      {properties.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.label}>🏘️ {p.titulo}</Text>
          <Text style={styles.sub}>👁️ Vistas: {p.views || 0}</Text>
          <Text style={styles.sub}>📌 Estado: {p.estado}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    color: "#6200ee",
    fontWeight: "bold",
  },
  sub: {
    fontSize: 14,
    color: "#333",
  },
});

export default Statictics;
