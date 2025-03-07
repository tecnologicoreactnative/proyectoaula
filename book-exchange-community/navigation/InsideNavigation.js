import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import VectorIcons from 'react-native-vector-icons/FontAwesome';

import Home from '../screens/HomeScreen';
import Profile from '../screens/ProfileScreen';
import Messages from '../screens/MessagesScreen';
import Search from '../screens/SearchScreen';
import AddBook from '../screens/AddBookScreen';

const Tab = createBottomTabNavigator();

export default function InsideNavigation() {

    return (
        <Tab.Navigator
            id="bottom-tab"
            initialRouteName="Home"
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
            <Tab.Screen name="AddBook" component={AddBook}
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
                                <VectorIcons name="envelope" color={color} size={size}/>
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




