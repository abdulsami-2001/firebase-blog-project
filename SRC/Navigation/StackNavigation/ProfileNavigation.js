import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import Profile from '../../Screens/Profile/Profile'
import Signup from '../../Screens/Signup/Signup'
import Login from '../../Screens/Login/Login'
import CustomHeader from '../../Components/CustomHeader'
import ChangePassword from '../../Screens/ChangePassword/ChangePassword'
import VerifyEmail from '../../Screens/VerifyEmail/VerifyEmail'

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
                options={{
                    title: NavigationStrings.PROFILE,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.SIGNUP}
                component={Signup}
                options={{
                    title: NavigationStrings.SIGNUP,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.LOGIN}
                component={Login}
                options={{
                    title: NavigationStrings.LOGIN,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.CHANGEPASSWORD}
                component={ChangePassword}
                options={{
                    title: NavigationStrings.CHANGEPASSWORD,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
            <Stack.Screen
                name={NavigationStrings.VERIFYEMAIL}
                component={VerifyEmail}
                options={{
                    title: NavigationStrings.VERIFYEMAIL,
                    header: (props) => <CustomHeader props={props} />
                }}
            />
        </Stack.Navigator>
    )
}

export default ProfileNavigation
