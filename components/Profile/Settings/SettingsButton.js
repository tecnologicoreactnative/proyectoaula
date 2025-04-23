import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";


const SettingsButton = () => {
  const navigation = useNavigation();
  return (
    <View>
        <Ionicons
          name="settings-outline"
          size={24}
          color="white"
          style={styles.icon}
          onPress={() => navigation.navigate("SettingScreen")}
        />
    </View>
  );
};

export default SettingsButton;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4f83cc',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    marginHorizontal: 10,
  },

});


