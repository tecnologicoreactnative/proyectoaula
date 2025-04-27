import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {View} from "react-native";

export default function Screens({children}) {

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, justifyContent: 'flex-start', padding: 10}}>
                {children}
            </View>
        </SafeAreaView>
    );
}

