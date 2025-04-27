import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../context/AppContext';
import { subscribeToMessages, sendMessage } from '../services/ServiceChat';
import { uploadImage } from '../services/ServiceStorage';

export default function ChatScreen({ route }) {
  const { chatId, otherUid } = route.params;
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);

  
  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, setMessages);
    return () => unsubscribe();
  }, [chatId]);


  const onSend = useCallback((msgs = []) => {
    const [m] = msgs;
    sendMessage(chatId, {
      text: m.text,
      user: { _id: user.uid, name: user.displayName },
    });
  }, [chatId, user]);


  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (res.cancelled) return;
    const url = await uploadImage(res.uri, `chats/${chatId}`);
    if (url) {
      sendMessage(chatId, {
        image: url,
        user: { _id: user.uid, name: user.displayName },
      });
    }
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      options={{
        ['Enviar Foto']: pickImage,
        Cancel: () => {},
      }}
      icon={() => <View style={styles.cameraIcon}><Text>📷</Text></View>}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user.uid, name: user.displayName }}
        renderActions={renderActions}
        showUserAvatar
        alwaysShowSend
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
});