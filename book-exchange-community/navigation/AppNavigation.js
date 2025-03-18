import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AuthNavigation from './AuthNavigation';
import InsideNavigation from './InsideNavigation';
import {AppContext} from "../context/AppContext";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    const {isAuthenticated} = React.useContext(AppContext);
    return (

        <Tab.Navigator
            id="app-tab"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {display: "none"}
            }}
        >
            {isAuthenticated ?
                <Tab.Screen name="Inside" component={InsideNavigation}/>
                :
                <Tab.Screen name="Auth" component={AuthNavigation}/>
            }
        </Tab.Navigator>
    );
}
