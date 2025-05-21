import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

export default function RegisterProperty() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');

  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setImage(selectedAsset.uri);
      }
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = uri.split('/').pop();
      const imageRef = ref(storage, `imagenesInmuebles/${filename}`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo la imagen a Firebase:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!image || !title || !description || !price || !city) {
      alert('Por favor llena todos los campos e incluye una imagen');
      return;
    }

    try {
      const imageUrI = await uploadImageToFirebase(image);

      const newProperty = {
        id: Date.now().toString(),
        titulo: title,
        descripcion: description,
        precio: parseFloat(price),
        ciudad: city,
        imagenURI: imageUrI,
        fecha: new Date().toISOString(),
      };

      const storedData = await AsyncStorage.getItem('inmuebles');
      const existingProperties = storedData ? JSON.parse(storedData) : [];

      const updatedProperties = [...existingProperties, newProperty];
      await AsyncStorage.setItem('inmuebles', JSON.stringify(updatedProperties));

      alert('Inmueble registrado exitosamente');

      navigation.navigate("Perfil");

      // Limpiar formularios
      setImage(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setCity('');
    } catch (error) {
      console.log('Error guardando propiedad:', error);
      alert('Hubo un error al guardar la propiedad');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Precio:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ciudad:</Text>
      <TextInput value={city} onChangeText={setCity} style={styles.input} />

      <Button title="Seleccionar imagen" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Guardar propiedad" onPress={handleUpload} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
});
