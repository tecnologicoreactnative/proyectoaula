import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebaseConfig";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  writeBatch
} from "firebase/firestore";

const PlatosContext = createContext({});

export const PlatosProvider = ({ children }) => {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los platos
  const getPlatos = async () => {
    try {
      console.log("Obteniendo platos...");
      setLoading(true);
      const platosRef = collection(db, "platos");
      const q = query(platosRef, orderBy("nombre"));
      const querySnapshot = await getDocs(q);
      
      const platosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Se encontraron ${platosData.length} platos`);
      setPlatos(platosData);
      setError(null);
    } catch (error) {
      console.error("Error al obtener platos:", error);
      if (error.code === 'permission-denied') {
        setError("Error de permisos al cargar los platos");
      } else {
        setError(`Error al cargar los platos: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo plato
  const addPlato = async (plato) => {
    try {
      console.log("Agregando nuevo plato:", plato.nombre);
      const platosRef = collection(db, "platos");
      const docRef = await addDoc(platosRef, {
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        precio: plato.precio,
        imagen: plato.imagen,
        fechaCreacion: new Date()
      });
      
      console.log(`Plato agregado con ID: ${docRef.id}`);
      await getPlatos();
      return docRef.id;
    } catch (error) {
      console.error("Error al agregar plato:", error);
      throw error;
    }
  };

  // Actualizar un plato existente
  const updatePlato = async (id, plato) => {
    try {
      console.log(`Actualizando plato con ID: ${id}`);
      const platoRef = doc(db, "platos", id);
      await updateDoc(platoRef, {
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        precio: plato.precio,
        imagen: plato.imagen,
        fechaActualizacion: new Date()
      });
      
      console.log("Plato actualizado exitosamente");
      await getPlatos();
    } catch (error) {
      console.error("Error al actualizar plato:", error);
      throw error;
    }
  };

  const deletePlato = async (id) => {
    try {
      console.log(`Eliminando plato con ID: ${id}`);
      const platoRef = doc(db, "platos", id);
      await deleteDoc(platoRef);
      
      console.log("Plato eliminado exitosamente");
      await getPlatos();
    } catch (error) {
      console.error("Error al eliminar plato:", error);
      throw error;
    }
  };

  useEffect(() => {
    getPlatos();
  }, []);

  return (
    <PlatosContext.Provider value={{
      platos,
      loading,
      error,
      getPlatos,
      addPlato,
      updatePlato,
      deletePlato
    }}>
      {children}
    </PlatosContext.Provider>
  );
};

export const usePlatos = () => {
  const context = useContext(PlatosContext);
  if (!context) {
    throw new Error('usePlatos debe ser usado dentro de un PlatosProvider');
  }
  return context;
}; 