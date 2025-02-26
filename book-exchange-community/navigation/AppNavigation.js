import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AuthNavigation from './AuthNavigation';
import InsideNavigation from './InsideNavigation';
import {AppContext} from "../components/AppContext";

const Tab = createBottomTabNavigator();


export default function AppNavigation() {
const { isAuthenticated } = React.useContext(AppContext);
        console.log(isAuthenticated)
    return (
        <Tab.Navigator  initialRouteName={isAuthenticated ? 'Inside' : 'Auth'}
                        screenOptions={{
                            headerShown: false,
                            tabBarShowLabel: false,
                            tabBarStyle: { display: "none" }
                }}>
            <Tab.Screen name="Auth" component={AuthNavigation} />
            <Tab.Screen name="Inside" component={InsideNavigation}  />
        </Tab.Navigator>
    );
}
