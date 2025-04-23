import { View, Text, StyleSheet } from "react-native"

 const Ready = () =>{
    return(
        <View>
            <Text style={styles.text}>
                Preparate para mejorar tu vida!
            </Text>
        </View>
    );
};

export default Ready;

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: "400",
        color: "blue",
        fontfamily: "fantasy",
        fontStyle: "italic",
    }
});