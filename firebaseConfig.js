import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA6LMnqKjUlXsKDHBR-ebYBSTIgx1gwR04",
    authDomain: "joner-27150.firebaseapp.com",
    projectId: "joner-27150",
    storageBucket: "joner-27150.firebasestorage.app",
    messagingSenderId: "437055016438",
    appId: "1:437055016438:web:393b0b4cf7d5f0d7250bd7",
    measurementId: "G-VVP11TPDCH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
