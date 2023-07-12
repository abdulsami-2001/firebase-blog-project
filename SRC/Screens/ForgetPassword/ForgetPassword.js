import { connect } from 'react-redux'
import React, { useState } from 'react'
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters';
import { Creators } from '../../Redux/Action/Action'
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message';
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';

const ForgetPassword = ({ isUserLoggedIn }) => {
    const { width, height } = Dimensions.get('screen')
    const [Password, SetPassword] = useState("");
    const [Code, SetCode] = useState("");
    const [Email, SetEmail] = useState("");
    const navigation = useNavigation()

    const changeEmailHandler = () => {
        if (Email != '') {
            sendForgetPassword_EmailFirebase()
        } else if (Email == '') {
            showMessage({
                message: "Email Not Be Empty",
                type: "warning",
            })
        } else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
            })
        }
    }

    const sendForgetPassword_EmailFirebase = async () => {
        showMessage({
            message: "Password reset email sending...",
            type: "info",
        });

        auth().sendPasswordResetEmail(Email)
            .then(() => {
                // Password successfully updated
                showMessage({
                    message: "Password reset email sent successfully",
                    type: "info",
                });
                navigation.navigate(NavigationStrings.LOGIN)
            })
            .catch(error => {
                // Handle password update error
                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is not valid.",
                        type: "warning",
                    });
                } else if (error.code === 'auth/missing-android-pkg-name') {
                    showMessage({
                        message: "An Android package name must be provided if the Android app is required to be installed.",
                        type: "warning",
                    })
                } else if (error.code === 'auth/user-not-found') {
                    showMessage({
                        message: "There is no user corresponding to the email address.",
                        type: "warning",
                    })
                } else {
                    showMessage({
                        message: "Something went wrong",
                        type: "danger",
                    });
                }
            });
    }


    // const changePasswordHandler = () => {
    //     if (Password != '' && Code != '') {
    //         confirmForgetPassword_CodeFirebase()
    //     } else if (Password == '' && Code == '') {
    //         showMessage({
    //             message: "New Password & Code Not Be Empty",
    //             type: "warning",
    //         });
    //     }
    //     else if (Password == '') {
    //         showMessage({
    //             message: "New Password Not Be Empty",
    //             type: "warning",
    //         });
    //     } else if (Code == '') {
    //         showMessage({
    //             message: "Code Not Be Empty",
    //             type: "warning",
    //         });
    //     } else {
    //         showMessage({
    //             message: "Some Unexpected Error",
    //             type: "warning",
    //         });
    //     }
    // }


    // const confirmForgetPassword_CodeFirebase = async () => {
    //     showMessage({
    //         message: "Forgeting...",
    //         type: "info",
    //     });

    //     auth().confirmPasswordReset(Code, Password)
    //         .then(() => {
    //             // Password successfully updated
    //             showMessage({
    //                 message: "Password successfully updated",
    //                 type: "info",
    //             });
    //             navigation.navigate(NavigationStrings.LOGIN)
    //         })
    //         .catch(error => {
    //             // Handle password update error
    //             if (error.code === 'auth/expired-action-code') {
    //                 showMessage({
    //                     message: "Password reset code has expired",
    //                     type: "warning",
    //                 });
    //             } else if (error.code === 'auth/invalid-action-code') {
    //                 showMessage({
    //                     message: "Password reset code is invalid",
    //                     type: "warning",
    //                 })
    //             } else if (error.code === 'auth/user-disabled') {
    //                 showMessage({
    //                     message: "The user corresponding to the given password reset code has been disabled",
    //                     type: "warning",
    //                 })
    //             } else if (error.code === 'auth/user-not-found') {
    //                 showMessage({
    //                     message: "There is no user corresponding to the email address.",
    //                     type: "warning",
    //                 })
    //             } else if (error.code === 'auth/weak-password') {
    //                 showMessage({
    //                     message: "New password is not strong enough",
    //                     type: "warning",
    //                 })
    //             } else {
    //                 showMessage({
    //                     message: "Something went wrong",
    //                     type: "danger",
    //                 });
    //             }
    //         });
    // }



    return (
        <View style={STYLES.mainCont}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.inputCont}>
                    <TextInput
                        label="Email"
                        keyboardType='visible-password'
                        value={Email}
                        type='outlined'
                        onChangeText={text => SetEmail(text)}
                        style={STYLES.input}
                    />
                    <View style={STYLES.btnCont}>
                        <Button mode="contained" style={STYLES.btn} onPress={changeEmailHandler}>
                            REQUEST CODE
                        </Button>
                    </View>
                    {/* <TextInput
                        label="Code"
                        keyboardType='visible-password'
                        value={Code}
                        type='outlined'
                        onChangeText={text => SetCode(text)}
                        style={STYLES.input}
                    />
                    <TextInput
                        label="New Password"
                        keyboardType='visible-password'
                        value={Password}
                        type='outlined'
                        onChangeText={text => SetPassword(text)}
                        style={STYLES.input}
                    />
                </View>
                <View style={STYLES.btnCont}>
                    <Button mode="contained" style={STYLES.btn} onPress={changePasswordHandler}>
                        {NavigationStrings.FORGETPASSWORD}
                    </Button> */}
                </View>
            </ScrollView>
        </View>
    )
}


const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myuserFavorites: Creators.userFavorites,
    myallBlogs: Creators.allBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFavorites: state.UserAuth.userFavorites,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        justifyContent: 'center',
    },
    lottieCont: (width, height) => ({
        width: width,
        height: height / 4,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    headingCont: {
        marginVertical: vs(20),
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center',
        color: ThemeColors.GRAY,
    },
    btnCont: {
        // alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    },
    input: {
        marginVertical: vs(8),
    },
})