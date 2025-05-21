import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/Firebase';


export async function getUserChats(userId) {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId)

  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


export function subscribeToUserChats(userId, callback, errorCallback) {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId)

  );
  return onSnapshot(q, snap => {
    const chats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(chats);
  }, errorCallback);
}

export async function createChat(participants) {
  const chatsRef = collection(db, 'chats');
  const chatData = {
    participants,
    lastUpdated: serverTimestamp()
  };
  const docRef = await addDoc(chatsRef, chatData);
  return docRef.id;
}

export async function findOrCreateChat(currentUid, otherUid) {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', currentUid)
  );
  const snap = await getDocs(q);
  for (const docSnap of snap.docs) {
    const { participants } = docSnap.data();
    if (participants.includes(otherUid)) {
      return docSnap.id;
    }
  }

  return await createChat([currentUid, otherUid]);
}


export function getChatMessagesRef(chatId) {
  return collection(db, 'chats', chatId, 'messages');
}


export async function addChatMessage(chatId, { text, senderId, createdAt = new Date() }) {
  const msgsRef = getChatMessagesRef(chatId);
  await addDoc(msgsRef, { text, senderId, createdAt });
  const chatDoc = doc(db, 'chats', chatId);
  await setDoc(chatDoc, { lastUpdated: createdAt }, { merge: true });
}
