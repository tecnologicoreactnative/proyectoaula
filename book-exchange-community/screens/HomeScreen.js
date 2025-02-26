import React from 'react';
import {Text, View} from 'react-native';
import {AppContext} from "../components/AppContext";

export default function HomeScreen({ navigation }) {

    const { isAuthenticated } = React.useContext(AppContext);
    const { user } = React.useContext(AppContext);
    {isAuthenticated ? navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]}) :
        navigation.getParent().navigate('Auth')
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen {isAuthenticated.toString()} {user.toString()}</Text>
        </View>
    );
}

