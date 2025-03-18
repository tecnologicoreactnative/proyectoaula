import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';


import WelcomeScreenSVG from '../../assets/WelcomeScreen.png';
export default function WelcomeScreen({ navigation }) {
    return (

        <SafeAreaView  style={styles.container}>
            <View style={styles.mainContent}>
                <ImageBackground
                    source={WelcomeScreenSVG}
                    style={styles.background}
                >
                </ImageBackground>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        resizeMode: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 0
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    button: {
        backgroundColor: '#025E73',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#F2A71B',
        fontSize: 20,
        fontWeight: '800'

    }
});
