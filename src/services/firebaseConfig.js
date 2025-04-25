import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
<<<<<<< HEAD
import { getFirestore } from 'firebase/firestore';
=======
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8

const firebaseConfig = {
  apiKey: "AIzaSyA79y1Z87QY1PcOgOjD9eIPwjfCkcW41lI",
  authDomain: "gestor-clinico-b6d3f.firebaseapp.com",
  projectId: "gestor-clinico-b6d3f",
  storageBucket: "gestor-clinico-b6d3f.firebasestorage.app",
  messagingSenderId: "670899595214",
  appId: "1:670899595214:web:cf8510ec0534725da6ad9f",
<<<<<<< HEAD
  measurementId: "G-YBNCHKFFGY"
=======
  measurementId: "G-YBNCHKFFGY",
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
<<<<<<< HEAD
const db = getFirestore(app);
export { auth,db };
=======

export { auth };
>>>>>>> 5e205e499d3bc3224f84638ebf3771bb48de7ae8
