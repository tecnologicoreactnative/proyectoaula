import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { AppContext } from '../context/AppContext';
import { getCollection } from '../services/ServiceFireStore';
import { findOrCreateChat } from '../services/ServiceChat';

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    (async () => {
      try {
        const fetched = await getCollection({ collectionName: 'users' });
        const list = Array.isArray(fetched) ? fetched : [];
        setUsers(list.filter(u => u.uid !== user.uid && u.location));
      } catch {
        setUsers([]);
      }
    })();
  }, [user.uid]);

 
  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

 
  const openChat = useCallback(async otherUid => {
    const chatId = await findOrCreateChat(user.uid, otherUid);
    navigation.navigate('Chat', { chatId, otherUid });
  }, [navigation, user.uid]);


  const markers = filtered.map(u => ({
    uid: u.uid,
    lat: u.location.latitude,
    lng: u.location.longitude,
    title: u.displayName
  }));
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0,width=device-width" />
      <script src="https://maps.googleapis.com/maps/api/js?key=${Constants.expoConfig.extra.GOOGLE_MAPS_JS_KEY}"></script>
      <script>
        const users = ${JSON.stringify(markers)};
        function initMap() {
          const center = users.length 
            ? { lat: users[0].lat, lng: users[0].lng } 
            : { lat: 6.2442, lng: -75.5812 };
          const map = new google.maps.Map(document.getElementById('map'), {
            center, zoom: 11
          });
          users.forEach(u => {
            const m = new google.maps.Marker({
              position: { lat: u.lat, lng: u.lng },
              map, title: u.title
            });
            m.addListener('click', () => {
              window.ReactNativeWebView.postMessage(u.uid);
            });
          });
        }
        window.onload = initMap;
      </script>
      <style>html,body,#map{margin:0;padding:0;height:100%;width:100%}</style>
    </head>
    <body><div id="map"></div></body>
  </html>`;

 
  const onMessage = e => openChat(e.nativeEvent.data);

  const mapHeight = Dimensions.get('window').height * 0.3;

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar usuario..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      <View style={{ height: mapHeight }}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={{ flex: 1 }}
          onMessage={onMessage}
          javaScriptEnabled
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={u => u.uid}
        contentContainerStyle={filtered.length === 0 && styles.empty}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openChat(item.uid)}>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>
          {query ? 'No se encontró usuario' : 'Empieza a escribir...'}
        </Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    height: 40, margin: 12, borderRadius: 8,
    borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10
  },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: 'bold' }, email: { color: '#666', marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 20 }
});