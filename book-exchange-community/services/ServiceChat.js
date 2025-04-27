import {  
  addDoc, collection, query, where, getDocs, doc, serverTimestamp, onSnapshot  
} from 'firebase/firestore';
import { db } from '../lib/Firebase';

export const findOrCreateChat = async (uid1, uid2) => {

  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', uid1));
  const snap = await getDocs(q);

  let chatDoc = null;
  snap.forEach(d => {
    const data = d.data();
    if (data.participants.includes(uid2)) {
      chatDoc = { id: d.id, ...data };
    }
  });

 
  if (!chatDoc) {
    const ref = await addDoc(chatsRef, {
      participants: [uid1, uid2],
      createdAt: serverTimestamp(),
    });
    chatDoc = { id: ref.id, participants: [uid1, uid2] };
  }

  return chatDoc.id;
};

export const subscribeToMessages = (chatId, callback) => {
  const msgsRef = collection(db, 'chats', chatId, 'messages');
  const q = query(msgsRef, serverTimestamp() && orderBy('createdAt', 'desc') );

 
  return onSnapshot(
    query(msgsRef, orderBy),
    snap => {
      const msgs = snap.docs
        .map(d => ({ _id: d.id, ...d.data(), createdAt: d.data().createdAt.toDate() }))
        .sort((a,b)=> b.createdAt - a.createdAt);
      callback(msgs);
    }
  );
};

export const sendMessage = async (chatId, message) => {
  const msgsRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(msgsRef, {
    ...message,
    createdAt: serverTimestamp(),
  });
};

export const getUserChats = async (uid) => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};