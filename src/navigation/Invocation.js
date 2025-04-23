import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/AutenticacionContext'; 
import Navigation from './Navigation';
import PortalNavigation from './PortalNavigation';

const Invocacion = () => {
  const { user } = useContext(AuthContext);
  return user ? <PortalNavigation /> : <Navigation />;
};

const InvocationNavigation = () => {
  return (
    <AuthProvider>
      <Invocacion />
    </AuthProvider>
  );
};

export default InvocationNavigation;
