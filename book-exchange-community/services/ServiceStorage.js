import {storage} from "../lib/Firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {Alert} from "react-native";
// import 'react-native-url-polyfill/auto';

export const uploadImage = async (imageUri, path) => {
    console.log("URI:", imageUri);
    console.log("Path:", path);

    if (!imageUri) {
        Alert.alert("Error", "Selecciona una imagen primero.");
        return null;
    }

    try {
        console.log("Subiendo imagen a Firebase Storage...");
        const response = await fetch(imageUri);
        const blob = await response.blob();


        const filename = `images/${path}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);
        console.log("Imagen subida correctamente:", filename);

        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen.");
        return null;
    }
};
