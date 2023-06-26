import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import NavigationStrings from '../../../Utils/NavigationStrings/NavigationStrings'
import Home from '../../../Screens/Home/Home'
import Favorite from '../../../Screens/Favorite/Favorite'
import MyBlogs from '../../../Screens/MyBlogs/MyBlogs'
import Profile from '../../../Screens/Profile/Profile'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'


const Tab = createBottomTabNavigator()

const MainTabNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Tab.Screen
                    name={NavigationStrings.HOME}
                    component={Home}
                    options={{
                        tabBarIcon: () => (<Ionicons name='home' size={24} />)
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.FAVORITES}
                    component={Favorite}
                    options={{
                        tabBarIcon: () => (<MaterialIcons name='favorite' size={24} />)
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.MYBLOGS}
                    component={MyBlogs}
                    options={{
                        tabBarIcon: () => (<Ionicons name='reader' size={24} />)
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.PROFILE}
                    component={Profile}
                    options={{
                        tabBarIcon: () => (<Feather name='user' size={24} />)
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainTabNavigation
