
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { getUserChats, findOrCreateChat } from '../services/ServiceChat';
import { getCollection } from '../services/ServiceFireStore';

export default function MessagesScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;
    getUserChats(user.uid)
      .then(setChats)
      .catch(console.error);
  }, [user]);

  
  useEffect(() => {
    (async () => {
      try {
        const all = await getCollection({ collectionName: 'users' });
        const list = Array.isArray(all) ? all : [];
        setUsers(list.filter(u => u.uid !== user.uid));
      } catch (e) {
        console.error('Error cargando usuarios:', e);
        setUsers([]); 
      }
    })();
  }, []);

  const filteredUsers = users.filter(u =>
    u.displayName?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

 
  const openChat = useCallback(async (otherUid) => {
    const chatId = await findOrCreateChat(user.uid, otherUid);
    navigation.navigate('Chat', { chatId, otherUid });
    setQuery('');           
  }, [navigation, user.uid]);

  
  const renderItem = ({ item }) => {
    if (query.trim() === '') {
    
      const otherUid = item.participants.find(uid => uid !== user.uid);
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => openChat(otherUid)}
        >
          <Text style={styles.name}>Chat con {otherUid}</Text>
          {}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => openChat(item.uid)}
        >
          <Text style={styles.name}>{item.displayName}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </TouchableOpacity>
      );
    }
  };


  const dataSource = query.trim() === '' ? chats : filteredUsers;

   return (
   <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar usuario o conversaciones..."
        value={query}
        autoCapitalize="none"
        onChangeText={setQuery}
      />

      <FlatList
        data={dataSource}
        keyExtractor={item => (query.trim() === '' ? item.id : item.uid)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>
            {query.trim() === ''
              ? 'No hay conversaciones aún'
              : 'No se encontró ningún usuario'}
          </Text>
        )}
      />
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
   
  },
 
});
