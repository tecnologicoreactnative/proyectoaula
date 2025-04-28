import React, { useEffect, useState, useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getCollection } from '../services/ServiceFireStore';
import { AppContext } from '../context/AppContext';
import { findOrCreateChat } from '../services/ServiceChat';

export default function SearchChatScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [allUsers, setAllUsers] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
   
    getCollection({ collectionName: 'users' })
      .then(users => 
        setAllUsers(users.filter(u => u.uid !== user.uid))
      )
      .catch(console.error);
  }, []);

 
  const filtered = allUsers.filter(u => 
    u.displayName?.toLowerCase().includes(q.toLowerCase()) ||
    u.email?.toLowerCase().includes(q.toLowerCase())
  );

  const handlePress = async (other) => {
    const chatId = await findOrCreateChat(user.uid, other.uid);
    navigation.navigate('Chat', { chatId, otherUid: other.uid });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar usuario..."
        value={q}
        onChangeText={setQ}
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={u => u.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => handlePress(item)}>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No se encontraron usuarios</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 10 },
  input: { borderWidth:1, borderColor:'#ccc', padding:8, borderRadius:6, marginBottom:10 },
  row: { padding:12, borderBottomWidth:1, borderColor:'#eee' },
  name: { fontWeight:'bold' },
  email: { color:'#666' },
  empty: { textAlign:'center', marginTop:20, color:'#999' },
});