import React from 'react';
import {NavigationContainer} from "@react-navigation/native";


import {AppProvider} from "./context/AppContext";
import AppNavigation from './navigation/AppNavigation';

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <AppNavigation/>
            </NavigationContainer>
        </AppProvider>
    );
}


