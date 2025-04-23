// screens/RegisterScreen.js
import React, { useState, useRef } from 'react';
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, Alert, Animated, Easing
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

const steps = [
  { key: 'email', placeholder: 'Correo Electrónico', keyboardType: 'email-address', secure: false },
  { key: 'password', placeholder: 'Contraseña', keyboardType: 'default', secure: true },
  { key: 'numeroDocumento', placeholder: 'Número de documento', keyboardType: 'number-pad', secure: false },
  { key: 'nombre', placeholder: 'Nombre', keyboardType: 'default', secure: false },
  { key: 'apellidos', placeholder: 'Apellidos', keyboardType: 'default', secure: false },
];

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '', password: '', numeroDocumento: '', nombre: '', apellidos: ''
  });
  const [step, setStep] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const direction = useRef(1); // 1: forward, -1: backward

  const animateSlide = (nextStep) => {
    direction.current = nextStep > step ? 1 : -1;

    Animated.sequence([
      Animated.timing(translateX, {
        toValue: direction.current * -500,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(translateX, {
        toValue: direction.current * 500,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      })
    ]).start(() => setStep(nextStep));
  };

  const handleInputChange = (text) => {
    const key = steps[step].key;
    setForm({ ...form, [key]: text });
  };

  const nextStep = () => {
    const key = steps[step].key;
    if (!form[key]) {
      return Alert.alert('Campo requerido', 'Por favor completa este campo');
    }

    if (step < steps.length - 1) {
      animateSlide(step + 1);
    } else {
      handleRegister();
    }
  };

  const prevStep = () => {
    if (step > 0) animateSlide(step - 1);
  };

  const handleRegister = async () => {
    const { email, password, numeroDocumento, nombre, apellidos } = form;
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'usuarios', user.uid), {
        email, numeroDocumento, nombre, apellidos, rol: 4
      });
      Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error en el registro', error.message);
    }
  };

  const currentStep = steps[step];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro - Paso {step + 1} de {steps.length}</Text>

      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX }] }]}>
        <TextInput
          placeholder={currentStep.placeholder}
          value={form[currentStep.key]}
          onChangeText={handleInputChange}
          style={styles.input}
          keyboardType={currentStep.keyboardType}
          secureTextEntry={currentStep.secure}
          autoCapitalize="none"
          placeholderTextColor="#274b6a"
        />
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>
          {step === steps.length - 1 ? 'Registrarse' : 'Siguiente'}
        </Text>
      </TouchableOpacity>

      {step > 0 && (
        <TouchableOpacity onPress={prevStep}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      )}

      <View style={styles.loginContainer}>
        <Text>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  animatedContainer: {
    width: '100%',
    alignItems: 'center'
  },
  input:     {
    width: '100%', height: 50, backgroundColor: '#f5f5f5',
    borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, color: '#274b6a'
  },
  button:    {
    backgroundColor: '#274b6a', borderRadius: 5,
    paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'center', marginBottom: 10
  },
  buttonText:{ color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backText:  { color: '#274b6a', marginBottom: 20 },
  loginContainer: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  loginText:      { color: '#274b6a', fontWeight: 'bold' },
});

export default RegisterScreen;

