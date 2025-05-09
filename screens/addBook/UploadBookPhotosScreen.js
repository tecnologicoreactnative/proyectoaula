import React, {useContext, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {View, Image, Alert, ScrollView} from "react-native";
import {Button} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {uploadImage} from "../../services/ServiceStorage";
import usePermissions from "../../hooks/Permissions";
import {AppContext} from "../../context/AppContext";
import {updateBook} from "../../services/ServiceBooks"; // Importar el servicio de permisos

export default function UploadPhotoScreen({navigation}) {
    const route = useRoute();
    const {idBook} = route.params;
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const {cameraPermission, galleryPermission} = usePermissions();
    const user = useContext(AppContext);


    const pickImage = async (fromCamera) => {
        if (fromCamera && !cameraPermission) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la cámara para tomar fotos.");
            return;
        }
        if (!fromCamera && !galleryPermission) {
            Alert.alert("Permiso denegado", "Se necesita acceso a la galería para seleccionar fotos.");
            return;
        }

        let result;

        if (fromCamera) {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [3, 4],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                aspect: [3, 4],
                quality: 1,
            });
        }

        if (!result.canceled) {
            setImages((prevImages) => [...prevImages, result.assets[0].uri].slice(0, 3));
        }
    };

    const handleUpload = async () => {
        if (images.length < 3) {
            Alert.alert("Error", "Debes subir al menos 3 fotos antes de continuar.");
            return;
        }

        setUploading(true);
        const uploadedImages = [];
        for (const image of images) {
            const downloadURL = await uploadImage(image, (user.user.uid + '/' + 'idBook'));
            if (downloadURL) {
                uploadedImages.push(downloadURL);
            }
        }
        setUploading(false);

        if (uploadedImages.length === images.length) {
            Alert.alert("Éxito", "Todas las imágenes han sido subidas correctamente.");
            setImages([]);
        }

        const updateBookData = {
            photos: uploadedImages,
            status: 'completed',
            available: true,
        }
        const success = await updateBook(idBook, updateBookData);
        if (success) {
            Alert.alert("Éxito", "Libro subido correctamente");
            navigation.navigate('AddBookScreen');
        }
    };

    return (
        <View style={{flex: 1, padding: 20, justifyContent: "center", alignItems: "center"}}>
            <ScrollView vertical>
                {images.map((img, index) => (
                    <Image key={index} source={{uri: img}} style={{width: 200, height: 250, margin: 5}}/>
                ))}
            </ScrollView>
            <View style={{width: '100%', flexDirection: "row", justifyContent: "center"}}>
                <Button mode="contained" onPress={() => pickImage(true)} style={{flex: 1, margin: 10}}
                        disabled={images.length >= 3} buttonColor={'#025E73'} textColor={'#F2A71B'}>
                    Tomar Foto
                </Button>
                <Button mode="contained" onPress={() => pickImage(false)} style={{flex: 1, margin: 10}}
                        disabled={images.length >= 3} buttonColor={'#025E73'} textColor={'#F2A71B'}>
                    Galería
                </Button>
            </View>
            <Button mode="contained" loading={uploading} disabled={uploading || images.length < 3}
                    onPress={handleUpload} buttonColor={'#025E73'} textColor={'#F2A71B'}>
                Subir Imágenes
            </Button>
        </View>
    );
};


