import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { usePlatos } from '../context/PlatosContext';

const EditPlatoScreen = ({ route, navigation }) => {
  const { plato } = route.params || {};
  const { addPlato, updatePlato } = usePlatos();
  
  const [nombre, setNombre] = useState(plato?.nombre || '');
  const [descripcion, setDescripcion] = useState(plato?.descripcion || '');
  const [precio, setPrecio] = useState(plato?.precio?.toString() || '');
  const [imagen, setImagen] = useState(plato?.imagen || null);
  const [isLoading, setIsLoading] = useState(false);

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error al convertir imagen a base64:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        if (base64) {
          setImagen(`data:image/jpeg;base64,${base64}`);
        } else {
          try {
            const convertedBase64 = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setImagen(`data:image/jpeg;base64,${convertedBase64}`);
          } catch (error) {
            console.error('Error al convertir imagen:', error);
            Alert.alert('Error', 'No se pudo procesar la imagen');
          }
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!nombre || !descripcion || !precio) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }

      if (!imagen) {
        Alert.alert('Error', 'Por favor seleccione una imagen');
        return;
      }

      setIsLoading(true);

      const platoData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precio.trim(),
        imagen: imagen,
      };

      if (plato?.id) {
        await updatePlato(plato.id, platoData);
      } else {
        await addPlato(platoData);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el plato. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre del plato</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese el nombre del plato"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese la descripción"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="Ingrese el precio (ej: $25.000)"
          keyboardType="default"
        />

        <TouchableOpacity 
          style={[
            styles.imageButton,
            isLoading && styles.disabledButton
          ]} 
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.imageButtonText}>
            {isLoading ? 'Procesando...' : imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Text>
        </TouchableOpacity>

        {imagen && (
          <Image 
            source={{ uri: imagen }} 
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            isLoading && styles.disabledButton
          ]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  }
});

export default EditPlatoScreen; 