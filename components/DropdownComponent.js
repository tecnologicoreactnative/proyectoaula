import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useFoodContext } from "../context/FoodContext";

const DropdownButton = () => {
  const { loadFoodsByCategory } = useFoodContext();
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([
    { id: 1, label: "vicio" },
    { id: 2, label: "visio" },
    { id: 3, label: "servicio" },
  ]);

  const handleSelectItem = async (item) => {
    setSelectedItem(item);
    try {
      const results = await loadFoodsByCategory(item.label);
    } catch (error) {}
    setVisible(false);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#f7f7f7",
          padding: 10,
          borderRadius: 5,
          borderColor: "#ddd",
          borderWidth: 1,
        }}
        onPress={() => setVisible(true)}
      >
        <Text style={{ fontSize: 16, color: "#666" }}>
          {selectedItem ? selectedItem.label : "Selecciona una categoria"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              width: 200,
            }}
          >
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item)}
                  style={{
                    padding: 10,
                    backgroundColor:
                      selectedItem?.id === item.id ? "#f0f0f0" : "transparent",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownButton;
