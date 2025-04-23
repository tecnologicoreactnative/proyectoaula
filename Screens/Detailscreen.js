/*import React from 'react';
import { View, Text } from 'react-native';
const Detailscreen = () => {
 return (
 <View style={{ flex: 1, justifyContent: 'center', alignItems:
'center' }}>
 <Text> Pantalla de Detalles</Text>
 </View>
 );
};
export default Detailscreen;
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';

const properties = [
  {
    id: '1',
    title: 'Casa Moderna en Medellín',
    price: '$250,000 USD',
    image: 'https://source.unsplash.com/featured/?house',
  },
  {
    id: '2',
    title: 'Apartamento en el Poblado',
    price: '$180,000 USD',
    image: 'https://source.unsplash.com/featured/?apartment',
  },
  {
    id: '3',
    title: 'Penthouse con Vista Panorámica',
    price: '$320,000 USD',
    image: 'https://source.unsplash.com/featured/?penthouse',
  },
];

const Detailescreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Encuentra tu Hogar Ideal</Text>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.image }} style={styles.image} />
            <Card.Content>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => navigation.navigate('Details')}>
                Ver Detalles
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    height: 180,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: '#009688',
    marginTop: 5,
  },
});

export default Detailescreen;*/
