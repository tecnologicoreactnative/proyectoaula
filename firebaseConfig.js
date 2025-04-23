// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCzcg3fIU4p0wj4tAqkJRvCULjWGa6BjM",
  authDomain: "react-firetive.firebaseapp.com",
  projectId: "react-firetive",
  storageBucket: "react-firetive.firebasestorage.app",
  messagingSenderId: "374257933387",
  appId: "1:374257933387:web:74351849a50810fd9981ce"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});