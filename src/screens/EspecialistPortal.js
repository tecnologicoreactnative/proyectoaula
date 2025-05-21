import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Modal, Platform, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { AuthContext } from '../context/AutenticacionContext';

const PortalEspecialista = ({ navigation }) => {
    const { user, logOut } = useContext(AuthContext);

    const [citasEspecialista, setCitasEspecialista] = useState([]);
    const [cargandoCitas, setCargandoCitas] = useState(true);

    const [mensaje, setMensaje] = useState('');
    const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);

    const mostrarMensajePersonalizado = (msg) => {
        setMensaje(msg);
        setMostrarModalMensaje(true);
    };

    const ocultarMensajePersonalizado = () => {
        setMostrarModalMensaje(false);
        setMensaje('');
    };

    const obtenerCitasEspecialista = async () => {
        if (!user || !user.uid) {
            console.log("ERROR DE OBTENCIÓN: No se encontró usuario o UID para cargar citas.");
            setCargandoCitas(false);
            return;
        }

        setCargandoCitas(true);
        try {
            const consultaEspecialista = query(collection(db, "users"), where("uid", "==", user.uid));
            const instantaneaEspecialista = await getDocs(consultaEspecialista);

            if (instantaneaEspecialista.empty) {
                console.log("ERROR DE OBTENCIÓN: No se encontró el documento del especialista para el usuario actual (UID:", user.uid, ").");
                setCargandoCitas(false);
                return;
            }

            const datosEspecialista = instantaneaEspecialista.docs[0].data();
            const nombreCompletoEspecialista = datosEspecialista.fullname || datosEspecialista.name;

            if (!nombreCompletoEspecialista) {
                console.log("ERROR DE OBTENCIÓN: No se encontró el nombre del especialista en los datos del usuario para el UID:", user.uid);
                setCargandoCitas(false);
                return;
            }
            console.log("Cargando citas para el especialista:", nombreCompletoEspecialista);
            const q = query(collection(db, "citas"), where("nombre_especialista", "==", nombreCompletoEspecialista));
            const instantaneaConsulta = await getDocs(q);
            const citas = instantaneaConsulta.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            citas.sort((a, b) => {
                const parsearFechaHora = (fechaStr, horaStr) => {
                    const [dia, mes, año] = fechaStr.split('/');
                    const [horas, minutos] = horaStr.split(':');
                    return new Date(año, mes - 1, dia, horas, minutos);
                };
                try {
                    const fechaA = parsearFechaHora(a.fecha, a.hora);
                    const fechaB = parsearFechaHora(b.fecha, b.hora);
                    return fechaA - fechaB;
                } catch (e) {
                    console.error("Error al analizar fecha/hora para ordenar:", e, "Cita A:", a, "Cita B:", b);
                    return 0;
                }
            });
            setCitasEspecialista(citas);
            console.log("Citas cargadas:", citas.length);

        } catch (error) {
            console.error("Error al cargar las citas del especialista:", error);
            mostrarMensajePersonalizado("Error al cargar las citas del especialista.");
        } finally {
            setCargandoCitas(false);
        }
    };

    useEffect(() => {
        obtenerCitasEspecialista();
    }, [user, user?.uid]);


    if (cargandoCitas) {
        return (
            <View style={estilos.contenedorCarga}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Cargando citas...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={estilos.contenedor}>
            <View style={estilos.encabezado}>
                <Text style={estilos.titulo}>Portal del Especialista</Text>
                <Image
                    source={require('../../assets/doctor-avatar.png')}
                    style={estilos.avatar}
                />
                <View style={estilos.infoDoctor}>
                    <Text style={estilos.nombre}>{'Dr. ' + (user?.name || 'Especialista')}</Text>
                </View>
            </View>

            <View style={estilos.menu}>
                <ElementoMenu titulo="Agendar Cita" onPress={() => navigation.navigate('Agendamiento')} icono="📝" />
                <ElementoMenu titulo="Historial de Pacientes" onPress={() => navigation.navigate('historial')} icono="📜" />
            </View>

            <View style={estilos.seccionCitas}>
                <Text style={estilos.tituloSeccion}>Mis Citas Agendadas</Text>
                {citasEspecialista.length === 0 ? (
                    <Text style={estilos.textoSinCitas}>No tienes citas agendadas para atender.</Text>
                ) : (
                    citasEspecialista.map((cita) => (
                        <View key={cita.id} style={estilos.tarjetaCita}>
                            <Text style={estilos.textoTarjetaCita}>📅 Fecha: {cita.fecha}</Text>
                            <Text style={estilos.textoTarjetaCita}>⏰ Hora: {cita.hora}</Text>
                            <Text style={estilos.textoTarjetaCita}>📍 Ubicación: {cita.ubicacion || 'No especificada'}</Text>
                            <Text style={estilos.textoTarjetaCita}>🩺 Motivo: {cita.motivo_cita || 'No especificado'}</Text>
                            <Text style={estilos.textoTarjetaCita}>Estado: <Text style={{ fontWeight: 'bold', color: cita.estado === 'Pendiente' ? '#ffc107' : cita.estado === 'Cancelada por especialista' ? '#dc3545' : '#28a745' }}>{cita.estado}</Text></Text>
                        </View>
                    ))
                )}
            </View>

            <View style={estilos.seccionCerrarSesion}>
                <TouchableOpacity
                    style={estilos.botonCerrarSesion}
                    onPress={async () => {
                        console.log("Intentando cerrar sesión...");
                        await logOut();
                        navigation.navigate('Login');
                    }}>
                    <Text style={estilos.textoBotonCerrarSesion}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={mostrarModalMensaje}
                onRequestClose={ocultarMensajePersonalizado}
            >
                <View style={estilos.vistaCentrada}>
                    <View style={estilos.vistaModal}>
                        <Text style={estilos.tituloModal}>Mensaje</Text>
                        <Text style={estilos.textoModal}>{mensaje}</Text>
                        <TouchableOpacity
                            style={[estilos.boton, estilos.botonCerrar]}
                            onPress={ocultarMensajePersonalizado}
                        >
                            <Text style={estilos.estiloTexto}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const ElementoMenu = ({ titulo, onPress, icono }) => (
    <TouchableOpacity style={estilos.elementoMenu} onPress={onPress}>
        <Text style={estilos.icono}>{icono}</Text>
        <View style={estilos.contenedorTextoMenu}>
            <Text style={estilos.tituloMenu}>{titulo}</Text>
            <Text style={estilos.subtituloMenu}></Text>
        </View>
        <Text style={estilos.flecha}>›</Text>
    </TouchableOpacity>
);

const estilos = StyleSheet.create({
    contenedor: {
        padding: 20,
        backgroundColor: '#add8e6',
        flexGrow: 1,
    },
    contenedorCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#add8e6',
    },
    encabezado: {
        alignItems: 'center',
        marginBottom: 30,
    },
    titulo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#fff',
    },
    infoDoctor: {
        alignItems: 'center',
    },
    nombre: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menu: {
        backgroundColor: '#90D5FF',
        borderRadius: 12,
        paddingVertical: 10,
        marginBottom: 20,
    },
    elementoMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomColor: '#2e3c5d',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    icono: {
        fontSize: 24,
        marginRight: 15,
    },
    contenedorTextoMenu: {
        flex: 1,
    },
    tituloMenu: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtituloMenu: {
        color: '#000',
        fontSize: 14,
    },
    flecha: {
        color: '#fff',
        fontSize: 20,
    },
    seccionCitas: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    tituloSeccion: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    textoSinCitas: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
    },
    tarjetaCita: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    tituloTarjetaCita: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 8,
    },
    textoTarjetaCita: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 4,
    },
    seccionCerrarSesion: {
        alignItems: 'center',
        marginTop: 20,
    },
    botonCerrarSesion: {
        backgroundColor: '#dc3545',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },
    textoBotonCerrarSesion: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    vistaCentrada: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    vistaModal: {
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
    tituloModal: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    textoModal: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
    boton: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        minWidth: 100,
        marginHorizontal: 5,
    },
    botonCerrar: {
        backgroundColor: '#2196F3',
        marginTop: 15,
    },
    estiloTexto: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default PortalEspecialista;