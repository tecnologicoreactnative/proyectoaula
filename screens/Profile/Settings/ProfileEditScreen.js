import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useUsersContext } from "../../../context/UsersContext";
import { Ionicons } from "@expo/vector-icons";
import Brand from "../../../components/Logo/Brand";
import { useNavigation } from "@react-navigation/native";

const ProfileEditScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const {
    users,
    CurrentUser,
    loading,
    error,
    getUser,
    loadAllUsers,
    updateUser,
  } = useUsersContext();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user?.email) {
      loadAllUsers();
      handleSearch();
    }
  }, [user]);

  const handleSearch = async () => {
    try {
      await getUser(user.email);

      if (CurrentUser) {
        setNewName(user.displayName || "");
        setName(CurrentUser.name || "");
        setLastname(CurrentUser.lastname || "");
        setBio(CurrentUser.bio || "");
        setLink(CurrentUser.link || "");
        setGender(CurrentUser.gender || "");
        setBirthday(
          CurrentUser.birthday ? formatDateForInput(CurrentUser.birthday) : ""
        );
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateBirthday = (dateStr) => {
    if (!dateStr) return true;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;

    const [, day, month, year] = dateStr.match(regex);
    const date = new Date(year, month - 1, day);

    return (
      !isNaN(date.getTime()) &&
      date.getDate() === parseInt(day, 10) &&
      date.getMonth() === parseInt(month, 10) - 1 &&
      date.getFullYear() === parseInt(year, 10) &&
      date <= new Date()
    );
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    if (birthday && !validateBirthday(birthday)) {
      Alert.alert(
        "Error",
        "Por favor ingresa una fecha válida en formato DD/MM/YYYY"
      );
      return;
    }

    const updates = {};
    if (newName.trim() && newName !== user.displayName)
      updates.displayName = newName;
    if (name.trim() !== (CurrentUser?.name || "")) updates.name = name;
    if (lastname.trim() !== (CurrentUser?.lastname || ""))
      updates.lastname = lastname;
    if (bio.trim() !== (CurrentUser?.bio || "")) updates.bio = bio;
    if (link.trim() !== (CurrentUser?.link || "")) updates.link = link;
    if (gender.trim() !== (CurrentUser?.gender || "")) updates.gender = gender;

    if (
      birthday &&
      birthday !==
        (CurrentUser?.birthday ? formatDateForInput(CurrentUser.birthday) : "")
    ) {
      const [day, month, year] = birthday.split("/");
      updates.birthday = new Date(year, month - 1, day).toISOString();
    }

    if (Object.keys(updates).length === 0) {
      Alert.alert("Información", "No hay cambios para guardar");
      return;
    }

    Alert.alert(
      "Confirmar cambios",
      "¿Estás seguro de que deseas guardar los cambios?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            setUploading(true);
            try {
              if (updates.displayName) {
                await updateProfile(user, { displayName: updates.displayName });
              }

              const firestoreUpdates = { ...updates };
              delete firestoreUpdates.displayName;

              if (Object.keys(firestoreUpdates).length > 0) {
                const success = await updateUser(user.email, firestoreUpdates);
                if (!success)
                  throw new Error("No se pudo actualizar en Firestore");
              }

              await getUser(user.email);

              Alert.alert(
                "Perfil actualizado",
                "Los cambios se guardaron correctamente"
              );
            } catch (error) {
              console.error("Error actualizando perfil:", error);
              Alert.alert("Error", "No se pudo actualizar el perfil");
            } finally {
              setUploading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePhotoUpdate = async () => {
    if (!user || !photoURL.trim()) return;

    Alert.alert(
      "Confirmar cambio de foto",
      "¿Estás seguro de que deseas actualizar tu foto de perfil?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            setUploading(true);
            try {
              const firestoreUpdates = {
                photoURL: photoURL,
              };

              const success = await updateUser(user.email, firestoreUpdates);
              if (!success)
                throw new Error("No se pudo actualizar en Firestore");

              await getUser(user.email);

              Alert.alert(
                "Foto actualizada",
                "La foto de perfil se actualizó correctamente"
              );
              setPhotoModalVisible(false);
              setPhotoURL("");
            } catch (error) {
              console.error("Error actualizando foto:", error);
              Alert.alert("Error", "No se pudo actualizar la foto de perfil");
            } finally {
              setUploading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SettingScreen")}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {(loading || uploading) && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {user && (
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.placeholderText}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setPhotoModalVisible(true)}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.displayName}>
                {user.displayName || "Usuario no identificado"}
              </Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={photoModalVisible}
          onRequestClose={() => setPhotoModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Actualizar foto de perfil</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="URL de nueva foto"
                placeholderTextColor="#999"
                value={photoURL}
                onChangeText={setPhotoURL}
                autoCapitalize="none"
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setPhotoModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonSave]}
                  onPress={handlePhotoUpdate}
                  disabled={uploading || !photoURL.trim()}
                >
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Guardar</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {user && (
          <TouchableOpacity
            style={styles.saveIcon}
            onPress={handleProfileUpdate}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#3498db" />
            ) : (
              <Ionicons name="save-outline" size={28} color="white" />
            )}
          </TouchableOpacity>
        )}

        {user && (
          <View style={styles.editSection}>
            <TextInput
              style={styles.input}
              placeholder="Nombre mostrado"
              placeholderTextColor="#999"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#999"
              value={lastname}
              onChangeText={setLastname}
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Biografía"
              placeholderTextColor="#999"
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Link personal (ej. sitio web)"
              placeholderTextColor="#999"
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
              keyboardType="url"
            />

            <TextInput
              style={styles.input}
              placeholder="Género"
              placeholderTextColor="#999"
              value={gender}
              onChangeText={setGender}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha de cumpleaños (DD/MM/YYYY)"
              placeholderTextColor="#999"
              value={birthday}
              onChangeText={setBirthday}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingTop: "20%",
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  placeholderText: {
    fontSize: 48,
    color: "#000",
    fontWeight: "bold",
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    borderColor: "#3498db",
    borderWidth: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#ccc",
  },
  additionalInfo: {
    backgroundColor: "#000",
    borderColor: "#3498db",
    borderWidth: 1.5,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  editSection: {
    backgroundColor: "#000",
    borderColor: "#3498db",
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#3498db",
  },
  saveIcon: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#000",
    borderColor: "#3498db",
    borderWidth: 2,
    borderRadius: 10,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#3498db",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: "48%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#3498db",
  },
  buttonCancel: {
    backgroundColor: "#000",
  },
  buttonSave: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 20,
    padding: 8,
  },
});

export default ProfileEditScreen;
