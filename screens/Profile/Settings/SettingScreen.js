import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/Profile/Settings/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import AppLogoImage2 from "../../../components/Logo/AppLogoImage2";
import BrandText from "../../../components/Logo/BrandText";

const SettingScreen = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingTop: "20%" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("TabHome", { screen: "Profile" })}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#3498db" />
          </TouchableOpacity>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Configuración de cuenta</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ProfileEditScreen")}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="person"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Editar perfil</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ChangePasswordScreen")}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Cambiar contraseña</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("DeleteAccountScreen")}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="trash"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Borrar cuenta</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="shield"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Privacidad</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>
          </View>

         {/*  <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notificaciones</Text>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="notifications"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Configurar notificaciones</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="volume-high"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Sonidos</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Correos electrónicos</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>
          </View> */}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ayuda y soporte</Text>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="help-circle"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Centro de ayuda</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name="chatbubbles"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Contactar soporte</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("TermsScreen")}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color="white"
                  style={styles.iconLeft}
                />
                <Text style={styles.buttonText}>Términos y condiciones</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="white"
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingtop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <AppLogoImage2 />
              <BrandText />
            </View>
            <View style={{ marginLeft: 20 }}>
              <Ionicons
                name="logo-github"
                size={24}
                color="white"
                style={styles.icon}
                onPress={() =>
                  Linking.openURL(
                    "https://github.com/BDanl/Proyecto-Rutina-de-Ejercicios-/tree/sort"
                  )
                }
              />
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View
              style={{ width: "70%", alignSelf: "center", paddingBottom: 10 }}
            >
              <LogoutButton />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
  },
  button: {
    backgroundColor: "#595963",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    flex: 1,
    marginLeft: 10,
    textAlign: "left",
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 15,
    zIndex: 10,
    padding: 8,
  },
});

export default SettingScreen;
