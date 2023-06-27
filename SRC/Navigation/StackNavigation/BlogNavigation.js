import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import MyBlogs from '../../Screens/MyBlogs/MyBlogs'
import AddBlog from '../../Screens/AddBlog/AddBlog'

const Stack = createNativeStackNavigator()

const BlogNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name={NavigationStrings.MYBLOGS}
                component={MyBlogs}
            />
            <Stack.Screen
                name={NavigationStrings.ADDBLOG}
                component={AddBlog}
            />
        </Stack.Navigator>
    )
}

export default BlogNavigation
