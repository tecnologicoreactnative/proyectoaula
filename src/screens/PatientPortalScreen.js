import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, Text, ScrollView, StyleSheet, Platform, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig"; 
import { AuthContext } from "../context/AutenticacionContext"; 
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";


const EmojiPicker = ({ onEmojiClick }) => {
    const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "🤩", "🥳", "😇", "🙂", "🙃", "🫠", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😢", "😭", "🥺", "🥹", "😩", "😫", "😖", "😣", "😞", "😔", "😟", "😕", "🙁", "☹️", "😮"]; // Solo algunos emojis para el ejemplo

    return (
        <View style={styles.emojiPickerGrid}>
            {emojis.map((emoji, index) => (
                <TouchableOpacity key={index} onPress={() => onEmojiClick({ emoji })}>
                    <Text style={styles.emojiItem}>{emoji}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

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
    const [userAppointments, setUserAppointments] = useState([]); 
    const [loadingUserData, setLoadingUserData] = useState(true); 
    const [loadingAppointments, setLoadingAppointments] = useState(true); 
    const [message, setMessage] = useState(''); 
    const [showMessageModal, setShowMessageModal] = useState(false); 

    const showCustomMessage = (msg) => {
        setMessage(msg);
        setShowMessageModal(true);
    };

    const hideCustomMessage = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    useEffect(() => {
        const fetchUserDataAndAppointments = async () => {
            if (user && user.uid) {
                setLoadingUserData(true);
                setLoadingAppointments(true);
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

                        if (data.citas && data.citas.length > 0) {
                            const appointmentsPromises = data.citas.map(async (citaId) => {
                                const citaDocRef = doc(db, "citas", citaId);
                                const citaDocSnap = await getDoc(citaDocRef);
                                if (citaDocSnap.exists()) {
                                    return { id: citaDocSnap.id, ...citaDocSnap.data() };
                                }
                                return null;
                            });
                            const fetchedAppointments = (await Promise.all(appointmentsPromises)).filter(Boolean);
                            setUserAppointments(fetchedAppointments);
                        } else {
                            setUserAppointments([]);
                        }
                    } else {
                        console.log("No se encontró información del usuario con este UID:", user.uid);
                        setUserData(null);
                        setEditedData(null);
                        setUserAppointments([]);
                    }
                } catch (error) {
                    console.error("Error al obtener datos del usuario o citas:", error);
                    showCustomMessage("Error al cargar los datos del usuario o sus citas.");
                    setUserData(null);
                    setEditedData(null);
                    setUserAppointments([]);
                } finally {
                    setLoadingUserData(false);
                    setLoadingAppointments(false);
                }
            }
        };
        fetchUserDataAndAppointments();
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
                showCustomMessage("No se pudo guardar el emoji.");
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
                showCustomMessage("Información actualizada correctamente.");
            } catch (error) {
                console.error("Error al actualizar la información:", error);
                showCustomMessage("No se pudo actualizar la información.");
            }
        }
    };

    if (loadingUserData || loadingAppointments) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando información del portal...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={[styles.title, { textAlign: 'center' }]}>Portal del Paciente </Text>
                <Text style={[styles.welcome, { textAlign: 'center' }]} >{`Bienvenido al portal del paciente ${user?.name || ''}`}</Text>
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
                        <Text style={styles.sectionTitle}>Mi Información</Text>
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
                                        keyboardType="numeric"
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
                                        keyboardType="phone-pad"
                                    />
                                    <View style={styles.buttonGroup}>
                                        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                                            <Text style={styles.buttonText}>Guardar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => {
                                            setIsEditing(false);
                                            setEditedData(userData);
                                        }}>
                                            <Text style={styles.buttonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
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
                                    <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => setIsEditing(true)}>
                                        <Text style={styles.buttonText}>Editar Información</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}

                {}
                <View style={styles.appointmentsContainer}>
                    <Text style={styles.sectionTitle}>Mis Citas Agendadas</Text>
                    {userAppointments.length === 0 ? (
                        <Text style={styles.noAppointmentsText}>No tienes citas agendadas en este momento.</Text>
                    ) : (
                        userAppointments.map((appointment) => (
                            <View key={appointment.id} style={styles.appointmentItem}>
                                <Text style={styles.appointmentText}>📅 Fecha: {appointment.fecha}</Text>
                                <Text style={styles.appointmentText}>⏰ Hora: {appointment.hora}</Text>
                                <Text style={styles.appointmentText}>👨‍⚕️ Especialista: {appointment.nombre_especialista}</Text>
                                <Text style={styles.appointmentText}>Estado: {appointment.estado}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.bottomButton, styles.agendaButton]} onPress={() => navigation.navigate("Citas")}>
                    <Text style={styles.buttonText}>Ir a la agenda</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton, styles.logoutButton]} onPress={() => {
                    navigation.navigate("Login");
                }}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showMessageModal}
                onRequestClose={hideCustomMessage} 
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Mensaje</Text>
                        <Text style={styles.modalText}>{message}</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={hideCustomMessage}
                        >
                            <Text style={styles.textStyle}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    welcome: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
    },
    emojiButton: {
        alignSelf: 'center',
        marginBottom: 20,
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
    },
    selectedEmoji: {
        fontSize: 40,
    },
    emojiPickerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    emojiPickerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    emojiItem: {
        fontSize: 30,
        padding: 5,
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    userInfo: {
      
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#444',
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        height: 50, 
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    editButton: {
        backgroundColor: '#007bff',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    appointmentsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    appointmentItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    appointmentText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#495057',
    },
    noAppointmentsText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    bottomButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    agendaButton: {
        backgroundColor: '#007bff',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
   
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', 
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', 
        maxWidth: 400, 
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        minWidth: 100,
        marginHorizontal: 5,
    },
    buttonClose: {
        backgroundColor: '#2196F3', 
        marginTop: 15,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});


export default PatientPortalScreen;
