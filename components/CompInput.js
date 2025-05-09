import React from "react";

import {StyleSheet, TextInput} from "react-native";

export default function CompInput({ placeholder, onChangeText, secureTextEntry }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: '#BFB78F',
        padding: 10,
        marginVertical: 5,
        borderRadius: 50,
        fontSize: 20
    }
});