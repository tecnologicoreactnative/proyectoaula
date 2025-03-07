import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import app from '../lib/Firebase';
import {AppContext} from "../context/AppContext";
import {Alert} from "react-native";
import {useContext} from "react";
import {createRecord} from "./ServiceFireStore";

export function useLogin() {
    const auth = getAuth(app);
    const {setIsAuthenticated, setUser} = useContext(AppContext);

    return async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            setIsAuthenticated(false);
            Alert.alert('Error', error.message);
            switch (error.code) {
                case 'auth/user-not-found':
                    Alert.alert('Error', 'Usuario no encontrado');
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Error', 'Contraseña incorrecta');
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Error', 'Correo electrónico inválido');
                    break;
                case 'auth/invalid-credential':
                    Alert.alert('Error', 'Contraseña inválida');
                    break;
                default:
                    Alert.alert('Error', 'No se pudo iniciar sesión');
            }

            return false;
        }
    };
}

export function useRegister() {
    const auth = getAuth(app);
    return async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = {
                "userId": userCredential.user.uid,
                "userInfo": userCredential.user.providerData,
                "location": {"lat": null, "lng": null},
                "booksListed": [null],
                "booksRequested": [null],
                "chats": [null],
                "notifications": [null]
            };
            try {
                const response = await createRecord({collectionName: 'users', data: {user}});
                Alert.alert('Registro exitoso', 'Usuario creado correctamente');
                return true;
            } catch (e) {
                if (e.code === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'El correo electrónico ya está en uso');
                } else {
                    Alert.alert('Error', 'No se pudo crear el usuario');
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            return null;
        }
    }
}


/*
* export default function RegisterScreen({ navigation }) {

    const auth = getAuth(app);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleRegisterWithEmail = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = {
                    "userId": userCredential.user.uid,
                    "userInfo": userCredential.user.providerData,
                    "location": {"lat": null, "lng": null},
                    "booksListed": [null],
                    "booksRequested": [null],
                    "chats": [null],
                    "notifications": [null]
                };
                try {
                    const response = await createRecord({collectionName: 'users', data: {user}});
                    Alert.alert('Registro exitoso', 'Usuario creado correctamente');
                    navigation.navigate('Login');
                } catch (e) {
                    Alert.alert('Error', 'No se pudo crear el usuario');
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                Alert.alert('Error', errorMessage);
            });
    }
* */