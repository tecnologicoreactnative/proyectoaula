import { useFirestore } from "./useFirestore";
import { useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [CurrentUser, setCurrentUser] = useState(null);
  const {
    loading,
    error,
    addData,
    getData,
    updateData,
    deleteData,
    getAllData,
  } = useFirestore();

  const loadAllUsers = async () => {
    const result = await getAllData("users");
    setUsers(result);
    return result;
  };
  const getUser = async (title) => {
    const result = await getData(title);  
    setCurrentUser(result);
    return result;
  };
  
  const addUser = async (name, email, password, lastname, age, gender) => {
    return await addData("users", {
      email,
      password,
      name,
      lastname,
      age: Number(age),
      gender,
      createdAt: new Date().toISOString(),
    });
  };

const updateUser = async (email, data) => {
  return await updateData(email, data); 
};

  const deleteUser = async (email) => {
    return await deleteData("users", email);
  };

  return {
    users,
    CurrentUser,
    loading,
    error,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    loadAllUsers
  };
};
