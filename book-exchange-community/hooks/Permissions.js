import {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Alert} from "react-native";

const usePermissions = () => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();
            const {status: galleryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();

            setCameraPermission(cameraStatus === "granted");
            setGalleryPermission(galleryStatus === "granted");

            if (cameraStatus !== "granted" || galleryStatus !== "granted") {
                Alert.alert("Permiso denegado", "Es necesario permitir acceso a la cámara y galería.");
            }
        })();
    }, []);

    return {cameraPermission, galleryPermission};
};

export default usePermissions;

