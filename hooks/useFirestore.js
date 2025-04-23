import { useState } from 'react';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';


export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState([]);

  const getColId = async (targetTitle) => {
    try {
      setLoading(true);
      setError(null);
  
      const collections = ["exercises", "users", "workouts"];
      
      for (const collectionName of collections) {
        let field = "name"; 
        if (collectionName === "users") {
          field = "email"; 
        }
  
        const q = query(
          collection(db, collectionName),
          where(field, "==", targetTitle)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const objectid = doc.data().objectid || collectionName;
          setLoading(false);
          return objectid;
        }
      }
      
      setLoading(false);
      return null;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error en getColId:", err);
      return null;
    }
  };

  const getId = async (titleid) => {
    try {
      setLoading(true);
      setError(null);
      
      const colId = await getColId(titleid);
  
      if (!colId) {
        setLoading(false);
        return null;
      }
      const field = colId === "users" ? "email" : "name";
      
      const q = query(
        collection(db, colId),
        where(field, "==", titleid)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        setLoading(false);
        return docId;
      }
  
      setLoading(false);
      return null;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error en getId:", err);
      return null;
    }
  };

  const getData = async (titleInput) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!titleInput || titleInput.trim() === "") {
        setError("El título de búsqueda está vacío");
        setLoading(false);
        return null;
      }
      
      const colId = await getColId(titleInput);
      
      if (!colId) {
        setError("No se pudo determinar la colección del documento");
        setLoading(false);
        return null;
      }
      
      const docId = await getId(titleInput);
      
      if (!docId) {
        setError(`No se encontró documento con ${colId === "users" ? "email" : "nombre"} "${titleInput}"`);
        setLoading(false);
        return null;
      }
      
      const docRef = doc(db, colId, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setData(docData);
        setLoading(false);
        return docData;
      } else {
        setError(`Documento existe en ruta (${colId}/${docId}) pero no tiene datos`);
        setLoading(false);
        return null;
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error obteniendo datos en getData:", err);
      return null;
    }
  };

  const getAllData = async (collectionName) => {
    try {
      setLoading(true);
      setError(null);
      
      let colId = collectionName;
      
      if (!colId) {
        colId = await getColId();
      }
      
      if (!colId) {
        setError("No se pudo determinar la colección");
        setLoading(false);
        return [];
      }

      const querySnapshot = await getDocs(collection(db, colId));
      const dataList = [];
      
      querySnapshot.forEach((doc) => {
        dataList.push(doc.data());
      });
      
      setAllData(dataList);
      setLoading(false);
      return dataList;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error obteniendo getAllData:", err);
      return [];
    }
  };

  const addData = async (collectionName, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        objectid: collectionName,
      });
      
      console.log(`Documento agregado con éxito. ID: ${docRef.id}`);

      setLoading(false);
      return docRef.id;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error añadiendo datos:", err);
      return null;
    }
  };

  const updateData = async (titleInput, newData) => {
    try {
      setLoading(true);
      setError(null);
      
      const colId = await getColId(titleInput);
      
      if (!colId) {
        setError("No se pudo determinar la colección del documento");
        setLoading(false);
        return false;
      }
      
      const docId = await getId(titleInput);
      
      if (!docId) {
        setError(`No se encontró documento con título "${titleInput}"`);
        setLoading(false);
        return false;
      }
      
      await updateDoc(doc(db, colId, docId), newData);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error actualizando datos:", err);
      return false;
    }
  };

  const deleteData = async (titleInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const colId = await getColId(titleInput);
      
      if (!colId) {
        setError("No se pudo determinar la colección del documento");
        setLoading(false);
        return false;
      }
      
      const docId = await getId(titleInput);
      
      if (!docId) {
        setError(`No se encontró documento con título "${titleInput}"`);
        setLoading(false);
        return false;
      }
      
      await deleteDoc(doc(db, colId, docId));
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error eliminando datos:", err);
      return false;
    }
  };

  const getMultipleData = async (collectionName, field, value) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, collectionName), where(field, "==", value));
      const querySnapshot = await getDocs(q);
      
      const dataList = [];
      querySnapshot.forEach((doc) => {
        dataList.push({ id: doc.id, ...doc.data() });
      });
      
      setAllData(dataList);
      setLoading(false);
      return dataList;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error obteniendo múltiples datos:", err);
      return [];
    }
  };

  return {
    loading,
    error,
    data,
    allData,
    getColId,
    getId,
    getData,
    getAllData,
    addData,
    updateData,
    deleteData,
    getMultipleData,
    setError,
  };
};