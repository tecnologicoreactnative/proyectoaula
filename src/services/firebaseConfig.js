import { initializeApp } from 'firebase/app';
import { getAuth }         from 'firebase/auth';
import { getFirestore }    from 'firebase/firestore';
import { getDatabase }     from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD9Dda7UASUvm0OrV8u8hnYKpMM_EmFvSc",
  authDomain: "gestor-clinica-88d48.firebaseapp.com",
  projectId: "gestor-clinica-88d48",
  storageBucket: "gestor-clinica-88d48.firebasestorage.app",
  messagingSenderId: "43645842588",
  appId: "1:43645842588:web:f5d38c82eb4097d9e22959"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);    
const rtdb = getDatabase(app);    

export { auth, db, rtdb };
