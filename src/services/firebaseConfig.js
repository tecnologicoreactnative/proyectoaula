import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA79y1Z87QY1PcOgOjD9eIPwjfCkcW41lI",
  authDomain: "gestor-clinico-b6d3f.firebaseapp.com",
  projectId: "gestor-clinico-b6d3f",
  storageBucket: "gestor-clinico-b6d3f.firebasestorage.app",
  messagingSenderId: "670899595214",
  appId: "1:670899595214:web:cf8510ec0534725da6ad9f",
  measurementId: "G-YBNCHKFFGY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
