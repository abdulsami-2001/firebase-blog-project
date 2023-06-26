import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Home from '../../../Screens/Home/Home'
import Settings from '../../../Screens/Settings/Settings'
import NavigationStrings from '../../../Const/NavigationStrings/NavigationStrings'

const Stack = createNativeStackNavigator()

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name={NavigationStrings.HOME}
                    component={Home}
                />
                <Stack.Screen
                    name={NavigationStrings.SETTINGS}
                    component={Settings}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation
