import React from 'react';
import {View, Text} from 'react-native';
import AddBookForm from "../components/AddBookForm";
import GoogleBooksSearch from "../components/Test";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AddBookScreen() {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {/*<Text>Tus Libros</Text>*/}
                {/*<Text>Aún no has agregado libros</Text>*/}
                {/*<Text>¡Agrega tu primer libro!</Text>*/}
                {/*<AddBookForm/>*/}
                <GoogleBooksSearch/>
            </View>
        </SafeAreaView>
    );
}
