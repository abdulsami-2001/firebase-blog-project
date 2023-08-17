import { connect } from 'react-redux';
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import React, { useState, useEffect, useRef } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { showMessage, } from "react-native-flash-message";
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';
import { StyleSheet, Dimensions, View, ScrollView, TouchableOpacity, Text } from 'react-native'

const Login = ({ myUserState, isUserLoggedIn, myUserId, myuserBlogs, }) => {
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const { width, height } = Dimensions.get('screen')
    const password_ref = useRef()
    const navigation = useNavigation()

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
                    duration: 3000,
                    message: "Unable to fetch your blogs",
                    description: 'Make sure internet is working'
                })
            }
        } catch (error) {
            showMessage({
                duration: 3000,
                message: "Unable to fetch your blogs",
                description: 'Make sure internet is working'
            })
        }
    }

    const loginHandler = () => {
        if (Email != '' && Password != '') {
            loginFirebase()
            showMessage({
                message: "Logining In",
                type: "info",
                duration: 3000,
            });
        } else if (Email == '' && Password == '') {
            showMessage({
                message: "Email & Password Not Be Empty",
                type: "warning",
                duration: 3000,
            });
        }
        else if (Password == '') {
            showMessage({
                message: "Password Not Be Empty",
                type: "warning",
                duration: 3000,
            });
        }
        else if (Email == '') {
            showMessage({
                message: "Email Not Be Empty",
                type: "warning",
                duration: 3000,
            });
        }
        else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
                duration: 3000,
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
                    duration: 3000,
                });
                myUserState(true)
                SetEmail('')
                SetPassword('')
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is not valid",
                        type: "warning",
                        duration: 3000,
                    });
                } else if (error.code === 'auth/user-disabled') {
                    showMessage({
                        message: "Account is disabled",
                        description: 'Contact support team',
                        type: "warning",
                        duration: 3000,
                    });
                } else if (error.code === 'auth/user-not-found') {
                    showMessage({
                        message: "No user corresponding to the given email",
                        type: "warning",
                        duration: 3000,
                    });
                } else if (error.code === 'auth/wrong-password') {
                    showMessage({
                        message: "Password is invalid for the given email, or the account corresponding to the email does not have a password set",
                        type: "warning",
                        duration: 3000,
                    });
                } else {
                    showMessage({
                        message: "Something went wrong",
                        type: "warning",
                        duration: 3000,
                    });
                }
            });
    }

    return (
        <View style={STYLES.mainCont}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.inputCont}>
                    <TextInput
                        label="Email"
                        value={Email}
                        keyboardType='email-address'
                        underlineColor={ThemeColors.CGREEN}
                        activeUnderlineColor={ThemeColors.CGREEN}
                        type='outlined'
                        onChangeText={text => SetEmail(text)}
                        style={STYLES.input}
                        onSubmitEditing={() => {
                            password_ref.current.focus()
                        }}
                    />
                    <TextInput
                        label="Password"
                        keyboardType='email-address'
                        value={Password}
                        type='outlined'
                        underlineColor={ThemeColors.CGREEN}
                        activeUnderlineColor={ThemeColors.CGREEN}
                        onChangeText={text => SetPassword(text)}
                        style={STYLES.input}
                        ref={password_ref}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate(NavigationStrings.FORGETPASSWORD)}>
                        <Text style={STYLES.forgetPasword} >Forget password ?</Text>
                    </TouchableOpacity>
                </View>
                <View style={STYLES.btnCont}>
                    <Button mode="contained" style={STYLES.btn} onPress={loginHandler}>
                        {NavigationStrings.LOGIN}
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
    myallBlogs: Creators.allBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Login)


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
    headingCont: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 22
    },
    input: {
        marginVertical: vs(8),
        backgroundColor: ThemeColors.LIGHTGRAY
    },
    btnCont: {
        // alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    },
    forgetPasword: {
        alignSelf: 'flex-end',
        marginBottom: vs(3)
    }
})