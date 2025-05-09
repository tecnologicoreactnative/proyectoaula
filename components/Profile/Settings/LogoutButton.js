import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import app from '../../../firebaseConfig';

const LogoutButton = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    console.log("handleLogout called");
    
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: async () => {
            setIsLoading(true);
            const auth = getAuth(app);
            
            try {
              await auth.signOut();
              navigation.replace('LoginScreen');
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar sesión: " + error.message);
              console.error("Error en logout:", error);
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity 
      onPress={handleLogout}
      style={styles.button}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
            <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.icon} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  icon: {
    marginRight: 0,
  },
});

export default LogoutButton;
