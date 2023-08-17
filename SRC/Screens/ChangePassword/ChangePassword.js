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

const ChangePassword = ({ isUserLoggedIn }) => {
    const { width, height } = Dimensions.get('screen')
    const [Password, SetPassword] = useState("");
    const navigation = useNavigation()

    const changePasswordHandler = () => {
        if (Password != '') {
            changePasswordHandlerFirebase()
        } else if (Password == '') {
            showMessage({
                message: "New Password Not Be Empty",
                type: "warning",
            });
        } else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
            });
        }
    }


    const changePasswordHandlerFirebase = async () => {
        const singInUser = auth().currentUser
        showMessage({
            message: "Changing Password",
            type: "info",
        });
        singInUser.updatePassword(Password)
            .then(() => {
                // Password successfully updated
                showMessage({
                    message: "Password Changed Successfully",
                    type: "info",
                });
                SetPassword('')
                navigation.navigate(NavigationStrings.PROFILE)
            })
            .catch(error => {
                // Handle password update error
                if (error.code === 'auth/weak-password') {
                    showMessage({
                        message: "Password is weak",
                        description: 'Create a strong password',
                        type: "warning",
                        duration: 3500,
                    });
                } else if (error.code === 'auth/requires-recent-login') {
                    showMessage({
                        message: "Unable to change password",
                        description: 'Do login again and try again.',
                        type: "warning",
                        duration: 3500,
                    })
                } else {
                    showMessage({
                        message: "Something went wrong",
                        description: "Password is not changed",
                        type: "danger",
                    });
                }
            });
    }

    if (isUserLoggedIn) {
        return (
            <View style={STYLES.mainCont}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={STYLES.lottieCont(width, height)} >
                        <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                    </View>
                    <View style={STYLES.inputCont}>
                        <TextInput
                            label="New Password"
                            keyboardType='email-address'
                            value={Password}
                            type='outlined'
                            onChangeText={text => SetPassword(text)}
                            style={STYLES.input}
                            underlineColor={ThemeColors.CGREEN}
                            activeUnderlineColor={ThemeColors.CGREEN}
                        />
                    </View>
                    <View style={STYLES.btnCont}>
                        <Button mode="contained" style={STYLES.btn} onPress={changePasswordHandler}>
                            {NavigationStrings.CHANGEPASSWORD}
                        </Button>
                    </View>
                </ScrollView>
            </View>
        )
    } else {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading} >You're not logged in.</Text>
                    <Text style={STYLES.heading} >Login/signup is required.</Text>
                </View>
            </View>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)

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