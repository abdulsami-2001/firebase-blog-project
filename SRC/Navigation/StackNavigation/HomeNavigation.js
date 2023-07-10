import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../../Screens/Home/Home'
import Blog from '../../Screens/Blog/Blog'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import CustomHeader from '../../Components/CustomHeader'

const Stack = createNativeStackNavigator()

const HomeNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen
                name={NavigationStrings.HOME}
                component={Home}
                options={{
                    title: NavigationStrings.HOME,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.BLOG}
                component={Blog}
                options={{
                    title: NavigationStrings.BLOG,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
        </Stack.Navigator>
    )
}

export default HomeNavigation
