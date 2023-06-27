import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import NavigationStrings from '../../../Utils/NavigationStrings/NavigationStrings'

import { NavigationContainer } from '@react-navigation/native'
import AuthNavigation from './AuthNavigation'
import HomeNavigation from './HomeNavigation/HomeNavigation'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name={'AuthStack'}
                component={AuthNavigation}
            />
            <Stack.Screen
                name={'HpmeStack'}
                component={HomeNavigation}
            />
        </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation
