import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import Profile from '../../Screens/Profile/Profile'
import Signup from '../../Screens/Signup/Signup'
import Login from '../../Screens/Login/Login'

const Stack = createNativeStackNavigator()

const ProfileNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen
                name={NavigationStrings.PROFILE}
                component={Profile}
            />
            <Stack.Screen
                name={NavigationStrings.SIGNUP}
                component={Signup}
            />
            <Stack.Screen
                name={NavigationStrings.LOGIN}
                component={Login}
            />
        </Stack.Navigator>
    )
}

export default ProfileNavigation
