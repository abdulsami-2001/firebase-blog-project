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
import CustomHeader from '../../Components/CustomHeader'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'


const Tab = createBottomTabNavigator()

const MainTabNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: ThemeColors.CGREEN,
                    },
                    tabBarActiveTintColor: ThemeColors.BLACKOPACITY80,
                    tabBarInactiveTintColor: ThemeColors.WHITE,
                }}
            >
                <Tab.Screen
                    name={NavigationStrings.HOMESTACK}
                    component={HomeNavigation}
                    options={{
                        tabBarIcon: () => (<Ionicons name='home' size={24} color={ThemeColors.WHITE} />),
                        title: NavigationStrings.HOME,
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.FAVORITES}
                    component={Favorite}
                    options={{
                        tabBarIcon: () => (<MaterialIcons name='favorite' size={24} color={ThemeColors.WHITE} />),
                        headerShown: true,
                        title: NavigationStrings.FAVORITES,
                        header: (props) => <CustomHeader props={props} />
                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.BLOGSTACK}
                    component={BlogNavigation}
                    options={{
                        tabBarIcon: () => (<Ionicons name='reader' size={24} color={ThemeColors.WHITE} />),
                        title: NavigationStrings.MYBLOGS,
                        headerShown: false

                    }}
                />
                <Tab.Screen
                    name={NavigationStrings.PROFILESTACK}
                    component={ProfileNavigation}
                    options={{
                        tabBarIcon: () => (<FontAwesome name='user' size={24} color={ThemeColors.WHITE} />),
                        title: NavigationStrings.PROFILE,
                        headerShown: false

                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainTabNavigation
