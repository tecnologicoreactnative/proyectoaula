import React from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";

export default function CompButton({ text, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text} >{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        color: '#fff',
        backgroundColor: '#025E73',
        borderRadius: 50,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 20,
            height: 2
        },
        width: '100%',
        alignItems: 'center',
        verticalAlign: 'center'
    },
    text: {
        color: '#F2A71B',
        fontWeight: 'bold',
        fontSize: 20,
    }
});