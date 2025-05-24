import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './Navigation/NavigationStack'; // Flujo principal
import AuthStack from './Navigation/AuthStack'; // Flujo de autenticación
import { ProveedorAuth, AuthContext } from './Context/AuthContext';

const Rutas = () => {
  const { usuario } = useContext(AuthContext);
  return usuario ? <NavigationStack /> : <AuthStack />;
};
export default function App() {
  return (
    <ProveedorAuth>
      <NavigationContainer>
        <Rutas />
      </NavigationContainer>
    </ProveedorAuth>
  );
}
