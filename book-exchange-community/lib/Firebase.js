// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDzct6E6k5WNZcPI7nVgCjIVjW4cECMqDA",
    authDomain: "book-exchange-community.firebaseapp.com",
    projectId: "book-exchange-community",
    storageBucket: "book-exchange-community.firebasestorage.app",
    messagingSenderId: "580338402808",
    appId: "1:580338402808:web:17129d17aef1ce4c3e820d",
    measurementId: "G-53MX302MRQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;

