import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import Favorite from '../../Screens/Favorite/Favorite'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HomeNavigation from '../StackNavigation/HomeNavigation'
import BlogNavigation from '../StackNavigation/BlogNavigation'
import ProfileNavigation from '../StackNavigation/ProfileNavigation'


const Tab = createBottomTabNavigator()

const MainTabNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
            >
                <Tab.Screen
                    name={NavigationStrings.HOMESTACK}
                    component={HomeNavigation}
                    options={{
                        tabBarIcon: () => (<Ionicons name='home' size={24} />),
                        title: NavigationStrings.HOME,
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.FAVORITES}
                    component={Favorite}
                    options={{
                        tabBarIcon: () => (<MaterialIcons name='favorite' size={24} />),
                        headerShown: true
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.BLOGSTACK}
                    component={BlogNavigation}
                    options={{
                        tabBarIcon: () => (<Ionicons name='reader' size={24} />),
                        title: NavigationStrings.MYBLOGS,
                        headerShown: false

                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.PROFILESTACK}
                    component={ProfileNavigation}
                    options={{
                        tabBarIcon: () => (<FontAwesome name='user' size={24} />),
                        title: NavigationStrings.PROFILE,
                        headerShown: false

                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainTabNavigation
