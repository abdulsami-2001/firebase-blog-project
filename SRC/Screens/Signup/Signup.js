import { connect } from 'react-redux';
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters'
import React, { useState, useEffect } from 'react'
import { Creators } from '../../Redux/Action/Action';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import { showMessage, } from "react-native-flash-message";
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';

const SignUp = ({ myUserState, isUserLoggedIn, myUserId }) => {
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const { width, height } = Dimensions.get('screen')
    const navigation = useNavigation()

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        if (user != undefined && user != null) {
            myUserId(user.uid)
        }
        return subscriber; // unsubscribe on unmount
    }, [user])


    const signupHandler = () => {
        if (Email != '' && Password != '') {
            signupFirebase()

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

    const signupFirebase = async () => {
        await auth()
            .createUserWithEmailAndPassword(Email, Password)
            .then(() => {
                showMessage({
                    message: "Signup Successful",
                    type: "success",
                });
                myUserState(true)
                SetEmail('')
                SetPassword('')
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                console.log(error)
                if (error.code === 'auth/email-already-in-use') {
                    showMessage({
                        message: "Email address is already in use!",
                        type: "warning",
                    });
                } else if (error.code === 'auth/weak-password') {
                    showMessage({
                        message: "Create a strong password",
                        description: "Password should be atlease 6 characters.",
                        type: "warning",
                    });
                } else if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is invalid!",
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
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
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
                        {NavigationStrings.SIGNUP}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    lottieCont: (width, height) => ({
        width: width,
        height: height / 3,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    input: {
        marginVertical: vs(8),
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    }
})