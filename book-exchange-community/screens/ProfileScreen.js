import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {useLogout} from "../services/ServiceAuth";
import CompButton from "../components/CompButton";
import {AppContext} from "../context/AppContext";

export default function ProfileScreen() {
    const logout = useLogout();
    const user = useContext(AppContext);
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Profile Screen</Text>
            <Text>Usuario: {user.user.uid}</Text>
            <CompButton text={'logout'} onPress={logout}/>
        </View>
    );
}