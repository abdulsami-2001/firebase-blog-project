import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { TextInput, Button } from 'react-native-paper';
import { showMessage, } from "react-native-flash-message";
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';
import { Creators } from '../../Redux/Action/Action';
import { connect } from 'react-redux';

const Login = ({ myUserState, isUserLoggedIn }) => {
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const navigation = useNavigation()

    console.log("isUserLoggedIn ", isUserLoggedIn)


    const loginHandler = () => {
        if (Email != '' && Password != '') {
            loginFirebase()
            SetEmail('')
            SetPassword('')
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
                    message: "Signup Successful",
                    type: "success",
                });
                myUserState(true)
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                console.log(error)
                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is not valid",
                        type: "warning",
                    });
                }
                if (error.code === 'auth/user-disabled') {
                    showMessage({
                        message: "Account is disabled",
                        description: 'Contact Support Team',
                        type: "warning",
                    });
                }
                if (error.code === 'auth/user-not-found') {
                    showMessage({
                        message: "No user corresponding to the given email",
                        type: "warning",
                    });
                }
                if (error.code === 'auth/wrong-password') {
                    showMessage({
                        message: "Password is invalid for the given email, or the account corresponding to the email does not have a password set.",
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
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn
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