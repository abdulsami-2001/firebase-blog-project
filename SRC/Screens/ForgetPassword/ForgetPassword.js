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
                duration: 3000,
            })
        } else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
                duration: 3000,
            })
        }
    }

    const sendForgetPassword_EmailFirebase = async () => {
        showMessage({
            message: "Password reset email sending",
            type: "info",
            duration: 3000,
        });

        auth().sendPasswordResetEmail(Email)
            .then(() => {
                // Password successfully updated
                showMessage({
                    message: "Password reset email sent successfully",
                    type: "info",
                    duration: 3000,
                });
                navigation.navigate(NavigationStrings.LOGIN)
            })
            .catch(error => {
                // Handle password update error
                if (error.code === 'auth/invalid-email') {
                    showMessage({
                        message: "Email address is not valid",
                        type: "warning",
                        duration: 3000,
                    });
                } else if (error.code === 'auth/missing-android-pkg-name') {
                    showMessage({
                        message: "An Android package name must be provided if the Android app is required to be installed",
                        type: "warning",
                        duration: 3000,
                    })
                } else if (error.code === 'auth/user-not-found') {
                    showMessage({
                        message: "There is no user corresponding to the email address",
                        type: "warning",
                        duration: 3000,
                    })
                } else {
                    showMessage({
                        message: "Something went wrong",
                        type: "danger",
                        duration: 3000,
                    });
                }
            });
    }

    return (
        <View style={STYLES.mainCont}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.inputCont}>
                    <TextInput
                        label="Email"
                        keyboardType='email-address'
                        value={Email}
                        type='outlined'
                        onChangeText={text => SetEmail(text)}
                        style={STYLES.input}
                        underlineColor={ThemeColors.CGREEN}
                        activeUnderlineColor={ThemeColors.CGREEN}
                    />
                    <View style={STYLES.btnCont}>
                        <Button mode="contained" style={STYLES.btn} onPress={changeEmailHandler}>
                            REQUEST CODE
                        </Button>
                    </View>
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
        backgroundColor: ThemeColors.LIGHTGRAY,
    },
})