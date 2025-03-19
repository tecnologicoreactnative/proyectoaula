// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCzcg3fIU4p0wj4tAqkJRvCULjWGa6BjM",
  authDomain: "react-firetive.firebaseapp.com",
  projectId: "react-firetive",
  storageBucket: "react-firetive.firebasestorage.app",
  messagingSenderId: "374257933387",
  appId: "1:374257933387:web:74351849a50810fd9981ce",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
