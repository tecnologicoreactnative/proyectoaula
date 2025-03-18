import React from "react";

import {createStackNavigator} from "@react-navigation/stack";
import SearchBookScreen from "../screens/addBook/SearchBookScreen";
import AddBookDetailsScreen from "../screens/addBook/AddBookDetailsScreen";
import UploadBookPhotosScreen from "../screens/addBook/UploadBookPhotosScreen";
import AddBookScreen from "../screens/addBook/AddBookScreen";


export default function AddBookNavigation() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            id="add-book-stack"
            initialRouteName="AddBookScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#025E73',
                },
                headerTintColor: '#F2A71B',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
            }}

        >
            <Stack.Screen
                name="AddBookScreen"
                component={AddBookScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SearchBookScreen"
                component={SearchBookScreen}
                options={{
                    headerTitle: 'Paso 1: Buscar Libro',
                    headerLeft: () => null
                }}
                style={{
                    fex: 1,
                    width: '100%',
                    height: '100%',
                    padding: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'center',
                }}
            />
            <Stack.Screen
                name="AddBookDetailsScreen"
                component={AddBookDetailsScreen}
                options={{
                    headerTitle: 'Paso 2: Agregar Detalles'
                }}
            />
            <Stack.Screen
                name="UploadBookPhotosScreen" component={UploadBookPhotosScreen}
                options={{
                    headerTitle: 'Paso 3: Subir Fotos'
                }}
            />
        </Stack.Navigator>
    );
}

