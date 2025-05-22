import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const ProveedorAuth = ({ children }) => {
    const [usuario, setUsuario] = useState({nombre: "Invitado"});
    const iniciarSesion = (datosUsuario) => {

        // Aquí iría la lógica de autenticación
        setUsuario(datosUsuario);
    };
    const cerrarSesion = () => {
        setUsuario(null);
    };
    return (
        <AuthContext.Provider value={{
            usuario, iniciarSesion, cerrarSesion
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/*Aqui se definen los contextos de autentificacion 
permitiendo manejar los estados del usuario tanto incio como cierre*/