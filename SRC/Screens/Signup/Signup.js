import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { TextInput, Button } from 'react-native-paper';
import { showMessage, } from "react-native-flash-message";
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';

const SignUp = () => {
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const navigation = useNavigation()


    const signupHandler = () => {
        if (Email != '' && Password != '') {
            signupFirebase()
            SetEmail('')
            SetPassword('')
        } else if (Email == '') {
            showMessage({
                message: "Email Not Be Empty",
                type: "warning",
            });
        }
        else if (Password == '') {
            showMessage({
                message: "Password Not Be Empty",
                type: "warning",
            });
        }
        else if (Email == '' && Password == '') {
            showMessage({
                message: "Email & Password Not Be Empty",
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

    const signupFirebase = async () => {
        await auth()
            .createUserWithEmailAndPassword(Email, Password)
            .then(() => {
                showMessage({
                    message: "Signup Successful",
                    type: "success",
                });
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                console.log(error)
                if (error.code === 'auth/email-already-in-use') {
                    showMessage({
                        message: "Email address is already in use!",
                        type: "warning",
                    });
                }
                if (error.code === 'auth/weak-password') {
                    showMessage({
                        message: "Create a strong password",
                        description: "Password should be atlease 6 characters.",
                        type: "warning",
                    });
                }

                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is invalid!",
                        type: "warning",
                    });
                }
            });
    }

    return (
        <View style={STYLES.mainCont}>
            <ScrollView>
                <View style={STYLES.headingCont}>
                    <Text style={STYLES.heading}>SignUp</Text>
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
                    <Button mode="contained" style={STYLES.btn} onPress={signupHandler}>
                        Signup
                    </Button>
                </View>
            </ScrollView>
        </View>

    )
}

export default SignUp


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