import { useState, useEffect } from "react";
import { useFirestore } from "./useFirestore";

export const useFoods = () => {
  const [foods, setFoods] = useState([]);
  const [currentFood, setCurrentFood] = useState(null);
  const {
    loading,
    error,
    getAllData,
    getData,
    addData,
    updateData,
    deleteData,
    getMultipleData,
  } = useFirestore();

  const loadAllFoods = async () => {
    const result = await getAllData("foods");
    setFoods(result);
    return result;
  };

  const getFood = async (title) => {
    const result = await getData(title);
    setCurrentFood(result);
    return result;
  };

  const addFood = async (title, price, category) => {
    return await addData("foods", {
      title,
      price: parseInt(price),
      category,
    });
  };

  const updateFood = async (title, price, category) => {
    return await updateData(title, {
      title,
      price: parseInt(price),
      category,
    });
  };

  const deleteFood = async (title) => {
    return await deleteData(title);
  };

  const loadFoodsByCategory = async (category) => {
    const result = await getMultipleData("foods", "category", category);
    setFoods(result);
    return result;
  };

  return {
    foods,
    currentFood,
    loading,
    error,
    loadAllFoods,
    getFood,
    addFood,
    updateFood,
    deleteFood,
    loadFoodsByCategory,
  };
};
