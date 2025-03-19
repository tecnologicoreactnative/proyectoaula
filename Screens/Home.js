import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ navigation }) => {
 return (
 <View style={{ flex: 1, justifyContent: 'center', alignItems:
'center' }}>
 <Text> Home</Text>
 <Button title="Ir a Detalles" onPress={() =>
navigation.navigate('Details')} />
 </View>
 );
};
export default Home;