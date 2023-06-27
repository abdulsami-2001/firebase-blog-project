import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../../../Screens/Home/Home'
import Blog from '../../../Screens/Blog/Blog'
import NavigationStrings from '../../../Utils/NavigationStrings/NavigationStrings'

const Stack = createNativeStackNavigator()

const HomeNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name={NavigationStrings.HOME}
                component={Home}
            />
            <Stack.Screen
                name={NavigationStrings.BLOG}
                component={Blog}
            />
        </Stack.Navigator>
    )
}

export default HomeNavigation
