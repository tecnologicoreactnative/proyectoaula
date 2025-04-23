import { View, Text, StyleSheet } from "react-native";
const BrandText = () => {
  return (
    <View>
      <Text style={styles.title2}>
        xhealth
      </Text>
    </View>
  );
};

export default BrandText;

const styles = StyleSheet.create({
  title2: {
    fontSize: 10,
    color: "white",
    fontWeight: "500",
    alignSelf:"center",
    fontStyle: "italic",
  },
});