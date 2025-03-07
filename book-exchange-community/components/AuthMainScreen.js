import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground
} from 'react-native';
import Background from "../assets/Background.png";

export default function AuthMainScreen({ children }) {
    return (
        <View style={styles.container}>
            <ImageBackground source={Background} style={styles.background} >
                <View style={styles.mainContent}>
                    {children}
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '100%',
    }
});