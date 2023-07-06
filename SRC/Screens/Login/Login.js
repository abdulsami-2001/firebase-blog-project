import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { TextInput, Button } from 'react-native-paper';
import { showMessage, } from "react-native-flash-message";
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';
import { Creators } from '../../Redux/Action/Action';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore'

const Login = ({ myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs }) => {
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const navigation = useNavigation()
    // console.log("--------------")
    // console.log("isUserLoggedIn - Login Screen: ", isUserLoggedIn)
    // console.log("userIdentification - Login Screen: ", userIdentification)



    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        if (user != undefined && user != null) {
            myUserId(user.uid)
            getDataFromFirestore(user.uid)
        }
        return subscriber; // unsubscribe on unmount
    }, [user])

    const getDataFromFirestore = async (userTemp) => {
        try {
            const { _data: data } = await firestore()?.collection('Users')?.doc(userTemp)?.get()

            if (data != undefined) {
                myuserBlogs(data)
            } else {
                showMessage({
                    duration: 2000,
                    message: "Unable to fetch your blogs",
                    description: 'Make sure internet is working.'
                })
            }

        } catch (error) {
            showMessage({
                duration: 2000,
                message: "Unable to fetch your blogs",
                description: 'Make sure internet is working.'
            })
        }
    }

    const loginHandler = () => {
        if (Email != '' && Password != '') {
            loginFirebase()

        } else if (Email == '' && Password == '') {
            showMessage({
                message: "Email & Password Not Be Empty",
                type: "warning",
            });
        }
        else if (Password == '') {
            showMessage({
                message: "Password Not Be Empty",
                type: "warning",
            });
        }
        else if (Email == '') {
            showMessage({
                message: "Email Not Be Empty",
                type: "warning",
            });
        }
        else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
            });
        }
    }

    const loginFirebase = async () => {
        await auth()
            .signInWithEmailAndPassword(Email, Password)
            .then(() => {
                showMessage({
                    message: "Login Successful",
                    type: "success",
                });
                myUserState(true)
                SetEmail('')
                SetPassword('')
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                console.log(error)
                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is not valid",
                        type: "warning",
                    });
                } else if (error.code === 'auth/user-disabled') {
                    showMessage({
                        message: "Account is disabled",
                        description: 'Contact Support Team',
                        type: "warning",
                    });
                } else if (error.code === 'auth/user-not-found') {
                    showMessage({
                        message: "No user corresponding to the given email",
                        type: "warning",
                    });
                } else if (error.code === 'auth/wrong-password') {
                    showMessage({
                        message: "Password is invalid for the given email, or the account corresponding to the email does not have a password set.",
                        type: "warning",
                    });
                } else {
                    showMessage({
                        message: "Something went wrong",
                        type: "warning",
                    });
                }
            });
    }

    return (
        <View style={STYLES.mainCont}>
            <ScrollView>
                <View style={STYLES.headingCont}>
                    <Text style={STYLES.heading}>Login</Text>
                </View>
                <View style={STYLES.inputCont}>
                    <TextInput
                        label="Email"
                        value={Email}
                        keyboardType='email-address'
                        type='outlined'
                        onChangeText={text => SetEmail(text)}
                        style={STYLES.input}
                    />
                    <TextInput
                        label="Password"
                        keyboardType='visible-password'
                        value={Password}
                        type='outlined'
                        onChangeText={text => SetPassword(text)}
                        style={STYLES.input}
                    />
                </View>
                <View style={STYLES.btnCont}>
                    <Button mode="contained" style={STYLES.btn} onPress={loginHandler}>
                        Login
                    </Button>
                </View>
            </ScrollView>
        </View>

    )
}




const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    headingCont: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 22
    },
    input: {
        marginVertical: vs(8),
    },
    btnCont: {

    }
})