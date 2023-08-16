import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import MyBlogs from '../../Screens/MyBlogs/MyBlogs'
import AddBlog from '../../Screens/AddBlog/AddBlog'
import CustomHeader from '../../Components/CustomHeader'
import Editor from '../../Screens/Editor/Editor'
import ModifyBlog from '../../Screens/ModifyBlog/ModifyBlog'

const Stack = createNativeStackNavigator()

const BlogNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen
                name={NavigationStrings.MYBLOGS}
                component={MyBlogs}
                options={{
                    title: NavigationStrings.MYBLOGS,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.ADDBLOG}
                component={AddBlog}
                options={{
                    title: NavigationStrings.ADDBLOG,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.EDITOR}
                component={Editor}
                options={{
                    title: NavigationStrings.EDITOR,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.MODIFYBLOG}
                component={ModifyBlog}
                options={{
                    title: NavigationStrings.MODIFYBLOG,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
        </Stack.Navigator>
    )
}

export default BlogNavigation
