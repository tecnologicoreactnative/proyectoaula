import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import VectorIcons from 'react-native-vector-icons/FontAwesome';

import Home from '../screens/HomeScreen';
import Profile from '../screens/ProfileScreen';
import Messages from '../screens/MessagesScreen';
import Search from '../screens/SearchScreen';
import AddBookNavigation from "./AddBookNavigation";

const Tab = createBottomTabNavigator();

export default function InsideNavigation() {

    return (
        <Tab.Navigator
            id="inside-tab"
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    marginHorizontal: 10,
                    marginVertical: 15,
                    borderRadius: 30,
                    backgroundColor: '#025E73',
                },
                tabBarActiveTintColor: '#F2A71B',
                tabBarInactiveTintColor: '#BFB78F',
                headerShown: false,
                tabBarHideOnKeyboard: true,
                style: {borderRadius: 30, backgroundColor: '#025E73'},

            }}
        >
            <Tab.Screen name="Home" component={Home}
                        options={{
                            title: 'Inicio',
                            tabBarIcon: ({color, size}) => (
                                <VectorIcons name="home" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="Search" component={Search}
                        options={{
                            title: 'Buscar',
                            tabBarIcon: ({color, size}) => (
                                <VectorIcons name="search" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="AddBook" component={AddBookNavigation}
                        options={{
                            title: 'Agregar Libro',
                            tabBarIcon: ({color, size}) => (
                                <VectorIcons name="plus" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="MessagesScreen" component={Messages}
                        options={{
                            title: 'Mensajes',
                            tabBarIcon: ({color, size}) => (
                                <VectorIcons name="wechat" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="Profile" component={Profile}
                        options={{
                            title: 'Perfil',
                            tabBarIcon: ({color, size}) => (
                                <VectorIcons name="user" color={color} size={size}/>
                            ),
                        }}
            />
        </Tab.Navigator>
    );
}




