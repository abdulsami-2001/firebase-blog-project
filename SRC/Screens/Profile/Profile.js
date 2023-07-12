import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters'
import React, { useState, useEffect } from 'react'
import { Button, Text } from 'react-native-paper'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import { View, StyleSheet, Dimensions } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'

const Profile = ({ myUserState, myUserId, myuserBlogs, myuserFavorites }) => {
    const navigation = useNavigation()
    const { width, height } = Dimensions.get('screen')

    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        return subscriber; // unsubscribe on unmount
    }, [user])

    const singOutHandler = async () => {
        showMessage({
            message: "Signing Out...",
            type: "info",
        })
        await auth()
            .signOut()
            .then(() => {
                showMessage({
                    message: "Signout Successfull",
                    type: "success",
                })
                myUserState(false)
                myUserId('')
                myuserFavorites({})
                myuserBlogs({})
            }
            ).catch(() => {
                showMessage({
                    message: "Signout Unsuccessfull",
                    type: "danger",
                })
            })
    }

    

    if (user != undefined && user != null) {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.headingCont}>
                    <View style={STYLES.lottieCont(width, height)} >
                        <FontAwesome name='user-circle' color={ThemeColors.GRAY} size={180} />
                    </View>
                    <View style={STYLES.textCont} >
                        <Text style={STYLES.textHeading}>Email</Text>
                        <Text style={STYLES.text}>{user?.email}</Text>
                    </View>
                    <View style={STYLES.textCont} >
                        <Text style={STYLES.textHeading}>User id</Text>
                        <Text style={STYLES.text}>{user?.uid}</Text>
                    </View>
                    <View style={STYLES.textCont} >
                        <Text style={STYLES.textHeading}>Account creation</Text>
                        <Text style={STYLES.text}>{new Date(user?.metadata?.creationTime).toDateString()} {new Date(user?.metadata?.creationTime).toLocaleTimeString()}</Text>
                    </View>
                    <View style={STYLES.textCont} >
                        <Text style={STYLES.textHeading}>Last login</Text>
                        <Text style={STYLES.text}>{new Date(user?.metadata?.lastSignInTime).toDateString()} {new Date(user?.metadata?.lastSignInTime).toLocaleTimeString()}</Text>
                    </View>
                </View>
                <View style={STYLES.btnCont} >
                    <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.CHANGEPASSWORD)}>
                        CHANGE PASSWORD
                    </Button>
                    <Button mode="contained" style={STYLES.btn} onPress={() => singOutHandler()}>
                        SIGN OUT
                    </Button>
                </View>
            </View>
        )
    } else {
        return (
            <View style={STYLES.mainContNL}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/login-signup.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.subContNL} >
                    <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.LOGIN)}>
                        {NavigationStrings.LOGIN}
                    </Button>
                    <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.SIGNUP)}>
                        {NavigationStrings.SIGNUP}
                    </Button>
                </View>
            </View>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const STYLES = StyleSheet.create({
    textCont: {
        flexDirection: 'column',
        marginHorizontal: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: vs(5)
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    text: {
        marginLeft: ms(5),
        fontSize: 16,
        marginTop: vs(2),
        color: ThemeColors.GRAY,
    },
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    mainContNL: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        justifyContent: 'center',
        alignItems: 'center',
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
    subContNL: {
        // justifyContent: 'space-evenly',
        // alignItems: 'center',
        // backgroundColor: "pink"
    },
    headingCont: {
        marginVertical: vs(5),
        alignItems: 'center',
    },
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN,
    }
})

