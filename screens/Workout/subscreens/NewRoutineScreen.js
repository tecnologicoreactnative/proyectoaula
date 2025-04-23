import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const NewRoutineScreen = () => {
  const navigation = useNavigation();
  const cards = [
    { 
      id: 1, 
      title: "Sección 1", 
      icon: "weight-lifter", 
      color: "#19194d",
      screen: "Session1"
    },
    { 
      id: 2, 
      title: "Sección 2", 
      icon: "walk", 
      color: "#19194d",
      screen: "Session2"
    },
    { 
      id: 3, 
      title: "Sección 3", 
      icon: "rowing", 
      color: "#19194d",
      screen: "Session3"
    },
    { 
      id: 4, 
      title: "Sección 4", 
      icon: "diving", 
      color: "#19194d",
      screen: "Session4"
    },
  ];
  
  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[styles.card, { backgroundColor: card.color }]}
          onPress={() => navigation.navigate(card.screen)} 
        >
          <Icon name={card.icon} size={30} color="white" style={styles.icon} />
          <Text style={styles.cardText}>{card.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewRoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
    marginTop: 50, 
    justifyContent: "center",
  },
  card: {
    width: "90%", 
    height: 70, 
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  cardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  icon: {
    marginRight: 10,
  },
});