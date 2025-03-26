import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyCSlkzJvTfqsU7DCCyFsQpf_GqFtaVj1YY",
    authDomain: "pedidos1-8d606.firebaseapp.com",
    projectId: "pedidos1-8d606",
    storageBucket: "pedidos1-8d606.firebasestorage.app",
    messagingSenderId: "784194984088",
    appId: "1:784194984088:web:afd84b46eb063beaf858ed",
    measurementId: "G-LMMC4R446Q"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };