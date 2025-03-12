import React from 'react';
import {View, Text} from 'react-native';
import {useLogout} from "../services/ServiceAuth";
import CompButton from "../components/CompButton";

export default function ProfileScreen() {
    const logout = useLogout();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Profile Screen</Text>
            <CompButton text={'logout'} onPress={logout}/>
        </View>
    );
}