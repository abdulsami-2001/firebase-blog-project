import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import Profile from '../../Screens/Profile/Profile'
import Signup from '../../Screens/Signup/Signup'

const Stack = createNativeStackNavigator()

const ProfileNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
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
        </Stack.Navigator>
    )
}

export default ProfileNavigation
