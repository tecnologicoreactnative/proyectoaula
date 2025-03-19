import {storage} from "../lib/Firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {Alert} from "react-native";

export const uploadImage = async (imageUri, patch) => {
    if (!imageUri) {
        Alert.alert("Error", "Selecciona una imagen primero.");
        return null;
    }

    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const filename = `images/${patch}/${Date.now()}.jpg`;

        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);

        return await getDownloadURL(storageRef);
    } catch (error) {
        Alert.alert("Error", "No se pudo subir la imagen.");
        return null;
    }
};

