import { DocumentSnapshot } from 'firebase/firestore';
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AutenticacionContext';


const EspecialistPortal = ({ navigation }) => {
 const { user } = useContext(AuthContext);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>En Linea</Text>
        <Image
          source={require('../../assets/doctor-avatar.png')} 
          style={styles.avatar}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.name}>{'Dr. '+ user.name} </Text>
          
        </View>
      </View>

      {}
      <View style={styles.menu}>
        <MenuItem title="Cita" onPress={() => navigation.navigate('Agendamiento')} icon="📝" />
        <MenuItem title="Historial" onPress={() => navigation.navigate('historial')} icon="📜" />
        <MenuItem title="Pacientes" onPress={() => navigation.navigate('pacientes')} icon="👥" />
      </View>
      {}
      <View style={styles.cerrarSesion}>
       <TouchableOpacity
               style={{ backgroundColor: 'red', padding: 16, borderRadius: 12, marginBottom: 16 }}
               onPress={() => navigation.navigate('Login')} >
               <Text style={{ color: '#fff', fontSize: 16 }} >Cerrar Sesión</Text> 
               </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
//** *///** */


const MenuItem = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.icon}>{icon}</Text>
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}></Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#add8e6',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  doctorInfo: {
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  specialty: {
    color: '#ccc',
    fontSize: 16,
  },
  menu: {
    backgroundColor: '#90D5FF',
    borderRadius: 12,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#2e3c5d',
    borderBottomWidth: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSubtitle: {
    color: '#000',
    fontSize: 12,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    display: 'none',
  },
  cerrarSesion: {
    alignItems: 'flex-end',
    marginTop: 20,
    color: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
  },
});

export default EspecialistPortal;

  
  
  

