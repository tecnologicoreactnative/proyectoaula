import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, Text, Alert, ScrollView, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { AuthContext } from "../context/AutenticacionContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
//** */ //** */

const PatientPortalScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState("👤");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [documentTypes, setDocumentTypes] = useState([
        { label: "Cédula de Ciudadanía", value: "CC" },
        { label: "Tarjeta de Identidad", value: "TI" },
        { label: "Pasaporte", value: "PP" },
        { label: "Cédula de Extranjería", value: "CE" },
    ]);
    const [genders, setGenders] = useState([
        { label: "Masculino", value: "M" },
        { label: "Femenino", value: "F" },
        { label: "Otro", value: "O" },
    ]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.uid) {
                try {
                    const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const userDoc = userSnapshot.docs[0];
                        const data = userDoc.data();
                        setUserData(data);
                        setEditedData(data);
                        if (data.emoji) {
                            setSelectedEmoji(data.emoji);
                        }
                    } else {
                        console.log("No se encontró información del usuario con este UID:", user.uid);
                        setUserData(null);
                        setEditedData(null);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario:", error);
                    Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
                    setUserData(null);
                    setEditedData(null);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleEmojiSelect = async (emojiObject) => {
        setSelectedEmoji(emojiObject.emoji);
        setShowEmojiPicker(false);

        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    emoji: emojiObject.emoji,
                });
                console.log("Emoji guardado:", emojiObject.emoji);
            } catch (error) {
                console.error("Error al actualizar el emoji:", error);
                Alert.alert("Error", "No se pudo guardar el emoji.");
            }
        }
    };

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    name: editedData.name,
                    fullname: editedData.fullname,
                    email: editedData.email,
                    typedocument: editedData.typedocument,
                    documentNumber: editedData.documentNumber,
                    genre: editedData.genre,
                    adress: editedData.adress,
                    phone: editedData.phone,
                });
                setUserData(editedData);
                setIsEditing(false);
                Alert.alert("Éxito", "Información actualizada correctamente.");
            } catch (error) {
                console.error("Error al actualizar la información:", error);
                Alert.alert("Error", "No se pudo actualizar la información.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={[styles.title, { textAlign: 'center' }]}>Portal del Paciente </Text>
                <Text style={[styles.welcome, { textAlign: 'center' }]} >{`Bienvenido al portal del paciente ${user.name}`}</Text>
                <TouchableOpacity onPress={() => setShowEmojiPicker(true)} style={styles.emojiButton}>
                    <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
                </TouchableOpacity>

                {showEmojiPicker && (
                    <View style={styles.emojiPickerContainer}>
                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                        <Button title="Cerrar" onPress={() => setShowEmojiPicker(false)} />
                    </View>
                )}

                {userData && (
                    <View style={styles.infoContainer}>
                        <View style={styles.userInfo}>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.name}
                                        onChangeText={(text) => handleInputChange('name', text)}
                                        placeholder="Nombre"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.fullname}
                                        onChangeText={(text) => handleInputChange('fullname', text)}
                                        placeholder="Nombre Completo"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.email}
                                        onChangeText={(text) => handleInputChange('email', text)}
                                        placeholder="Email"
                                    />
                                    <Picker
                                        selectedValue={editedData.typedocument}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => handleInputChange('typedocument', itemValue)}
                                    >
                                        {documentTypes.map((item) => (
                                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                                        ))}
                                    </Picker>
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.documentNumber}
                                        onChangeText={(text) => handleInputChange('documentNumber', text)}
                                        placeholder="Número de Documento"
                                    />
                                    <Picker
                                        selectedValue={editedData.genre}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => handleInputChange('genre', itemValue)}
                                    >
                                        {genders.map((item) => (
                                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                                        ))}
                                    </Picker>
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.adress}
                                        onChangeText={(text) => handleInputChange('adress', text)}
                                        placeholder="Dirección"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={editedData.phone}
                                        onChangeText={(text) => handleInputChange('phone', text)}
                                        placeholder="Teléfono"
                                    />
                                    <Button title="Guardar" onPress={handleSave} />
                                    <Button title="Cancelar" onPress={() => {
                                        setIsEditing(false);
                                        setEditedData(userData);
                                    }} />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Nombre:</Text> {userData.name}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Apellido:</Text> {userData.fullname}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Email:</Text> {userData.email}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Tipo de Documento:</Text> {userData.typedocument}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Número de Documento:</Text> {userData.documentNumber}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Género:</Text> {userData.genre}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Dirección:</Text> {userData.adress}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <Text style={styles.label}>Teléfono:</Text> {userData.phone}
                                    </Text>
                                    <Button title="Editar Información" onPress={() => setIsEditing(true)} />
                                </>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    title="Ir a la agenda"
                    onPress={() => navigation.navigate("Citas")}
                    color="blue"
                />
                <Button
                    title="Cerrar sesión"
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                    color="#d9534f"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 70,
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: "bold",
    },
    welcome: {
        marginBottom: 16,
        fontSize: 16,
        color: "#2c3e50",
    },
    pickerContainer: {
        marginBottom: 12,
        borderWidth: 0.5,
        borderRadius: 15,
    },
    picker: {
        height: 50,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 5,
        borderColor: "#ccc",
    },
    errorText: {
        color: "red",
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center",
    },
    infoContainer: {
        flexDirection: 'row',
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#e0f7fa',
    },
    userInfo: {
        flex: 1,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    emojiButton: {
        marginTop: 5,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        alignSelf: 'center',
        marginBottom: 10,
    },
    selectedEmoji: {
        fontSize: 50,
    },
    emojiPickerContainer: {
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 'auto',
        paddingBottom: 20,
        backgroundColor: '#f0f0f0',
        paddingTop: 10,
    },
});

export default PatientPortalScreen;
