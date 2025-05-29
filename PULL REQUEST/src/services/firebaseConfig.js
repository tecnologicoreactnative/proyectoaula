import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClTmmWOdKHaZoHilB9YVCYBdw6ogum-Y0",
  authDomain: "crizmazo.firebaseapp.com",
  projectId: "crizmazo",
  storageBucket: "crizmazo.firebasestorage.app",
  messagingSenderId: "954719278904",
  appId: "1:954719278904:web:a89d4e0700f878eb6753cd",
  measurementId: "G-9B0VRQNBDG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
export { auth, db };

