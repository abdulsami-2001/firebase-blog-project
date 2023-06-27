import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../../Utils/NavigationStrings/NavigationStrings'
import Login from '../../../Screens/Auth/Login'

const Stack = createNativeStackNavigator()

const AuthNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name={NavigationStrings.LOGIN}
                component={Login}
            />
        </Stack.Navigator>
    )
}

export default AuthNavigation
