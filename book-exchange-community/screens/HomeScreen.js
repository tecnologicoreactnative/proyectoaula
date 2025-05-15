import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const CATEGORIAS = ["Historia", "Ciencia", "Biografías", "Autoayuda"];

export default function HomeScreen() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para buscar libros populares
  const fetchPopularBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://openlibrary.org/search.json?q=subject:fiction&sort=rating&limit=3"
      );
      setPopularBooks(response.data.docs);
      setError(null);
    } catch (err) {
      setError("Error al cargar libros populares");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar libros al montar el componente
  useEffect(() => {
    fetchPopularBooks();
  }, []);

  // Función para buscar libros por categoría
  const searchByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=subject:${encodeURIComponent(
          category
        )}&limit=6`
      );
      setPopularBooks(response.data.docs);
      setError(null);
    } catch (err) {
      setError(`Error al buscar libros de ${category}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Sección de libros populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Libros Populares</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A6EA9" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularBooks.map((libro, index) => (
                <TouchableOpacity key={index} style={styles.bookCard}>
                  {libro.cover_i ? (
                    <Image
                      source={{
                        uri: `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`,
                      }}
                      style={styles.bookCover}
                    />
                  ) : (
                    <View style={styles.bookCover}>
                      <Text style={styles.bookCoverText}>📚</Text>
                    </View>
                  )}
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {libro.title}
                  </Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {libro.author_name
                      ? libro.author_name.join(", ")
                      : "Autor desconocido"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Sección de categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIAS.map((categoria, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryButton}
                onPress={() => searchByCategory(categoria)}
              >
                <Text style={styles.categoryText}>{categoria}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  seeAllButton: {
    color: "#4A6EA9",
    fontWeight: "500",
  },
  bookCard: {
    width: 120,
    marginRight: 12,
  },
  bookCover: {
    width: 120,
    height: 160,
    backgroundColor: "#E0E5F2",
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bookCoverText: {
    fontSize: 40,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#red",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A6EA9",
  },
  bookCover: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "contain",
    backgroundColor: "#E0E5F2", // Fondo por si no hay imagen
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  searchBar: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
});
