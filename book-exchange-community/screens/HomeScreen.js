import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const CATEGORIAS = ["Historia", "Ciencia", "Biografías", "Autoayuda"];

export default function HomeScreen() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const searchByCategory = async (category) => {
    try {
      setLoading(true);
      setShowAll(false);
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

  const showAllBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://openlibrary.org/search.json?q=subject:fiction&limit=20"
      );
      setAllBooks(response.data.docs);
      setShowAll(true);
      setError(null);
    } catch (err) {
      setError("Error al cargar todos los libros");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
   
        <View style={styles.centeredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Libros Populares</Text>
            <TouchableOpacity onPress={showAllBooks}>
              <Text style={styles.seeAllButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4A6EA9" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.booksContainer}>
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
            </View>
          )}
        </View>

       
        <View style={styles.spacer} />

       
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


        {showAll && (
          <View style={styles.allBooksSection}>
            <Text style={styles.sectionTitle}>Todos los Libros</Text>
            <View style={styles.allBooksContainer}>
              {allBooks.map((libro, index) => (
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
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  centeredSection: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  allBooksSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    color: "#4A6EA9",
    fontWeight: "500",
  },
  booksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  allBooksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookCard: {
    width: 120,
    margin: 10,
    alignItems: "center",
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
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  categoryButton: {
    width: "48%",
    backgroundColor: "#025E73",
    borderRadius: 25,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  spacer: {
    height: 30,
  },
});