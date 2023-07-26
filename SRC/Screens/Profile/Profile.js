import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters'
import React, { useState, useEffect } from 'react'
import { Button, Text, Card, Avatar } from 'react-native-paper'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import { View, StyleSheet, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
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
            <>
                <StatusBar backgroundColor={ThemeColors.CGREEN} />
                <View style={STYLES.upperCont}>
                    <Card style={STYLES.card(width, height)} >
                        <Avatar.Icon size={100} color={ThemeColors.WHITE} style={STYLES.profileAvatar} icon={'account-circle'} />
                        <Text style={STYLES.text} >{user?.email}</Text>
                        <Text style={STYLES.uid} >{user?.uid}</Text>
                    </Card>
                </View>
                <View style={STYLES.midCont}>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7}  >
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'login'} />
                        <Text style={STYLES.signoutText} >Last login: {new Date(user?.metadata?.lastSignInTime).toDateString()} {new Date(user?.metadata?.lastSignInTime).toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7} >
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'clock-time-three'} />
                        <Text style={STYLES.signoutText} >Account creation: {new Date(user?.metadata?.creationTime).toDateString()} {new Date(user?.metadata?.creationTime).toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7}  onPress={() => navigation.navigate(NavigationStrings.VERIFYEMAIL)}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'email-check'} />
                        <Text style={STYLES.signoutText} >Verify email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7}  onPress={() => navigation.navigate(NavigationStrings.CHANGEPASSWORD)}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'key-arrow-right'} />
                        <Text style={STYLES.signoutText} >Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7}  onPress={() => singOutHandler()}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'logout'} />
                        <Text style={STYLES.signoutText} >{NavigationStrings.SIGNOUT}</Text>
                    </TouchableOpacity>
                </View>
            </>
        )

        // return (
        //     <View style={STYLES.mainCont}>
        //         <View style={STYLES.headingCont}>
        //             <View style={STYLES.lottieCont(width, height)} >
        //                 <FontAwesome name='user-circle' color={ThemeColors.GRAY} size={130} />
        //             </View>
        //             <View style={STYLES.textCont} >
        //                 <Text style={STYLES.textHeading}>Email verified</Text>
        //                 <Text style={STYLES.text}>{user?.emailVerified ? "Yes" : "No"}</Text>
        //             </View>
        //             <View style={STYLES.textCont} >
        //                 <Text style={STYLES.textHeading}>Email</Text>
        //                 <Text style={STYLES.text}>{user?.email}</Text>
        //             </View>
        //             <View style={STYLES.textCont} >
        //                 <Text style={STYLES.textHeading}>Last login</Text>
        //                 <Text style={STYLES.text}>{new Date(user?.metadata?.lastSignInTime).toDateString()} {new Date(user?.metadata?.lastSignInTime).toLocaleTimeString()}</Text>
        //             </View>
        //             <View style={STYLES.textCont} >
        //                 <Text style={STYLES.textHeading}>Account creation</Text>
        //                 <Text style={STYLES.text}>{new Date(user?.metadata?.creationTime).toDateString()} {new Date(user?.metadata?.creationTime).toLocaleTimeString()}</Text>
        //             </View>
        //             <View style={STYLES.textCont} >
        //                 <Text style={STYLES.textHeading}>User id</Text>
        //                 <Text style={STYLES.text}>{user?.uid}</Text>
        //             </View>
        //         </View>
        //         <View style={STYLES.btnCont} >
        //             <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.CHANGEPASSWORD)}>
        //                 {NavigationStrings.CHANGEPASSWORD}
        //             </Button>
        //             <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.VERIFYEMAIL)}>
        //                 {NavigationStrings.VERIFYEMAIL}
        //             </Button>
        //             <Button mode="contained" style={STYLES.btn} onPress={() => singOutHandler()}>
        //                 SIGN OUT
        //             </Button>
        //         </View>
        //     </View>
        // )
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
    profileAvatar: {
        backgroundColor: ThemeColors.CGREEN,
        alignSelf: 'center',
    },
    bottomAvatar: {
        backgroundColor: ThemeColors.CGREEN
    },
    signoutText: {
        paddingLeft: ms(10),
    },
    cont: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        // backgroundColor: 'orange',
        marginBottom: vs(3)
    },
    upperCont: {
        flex: 2,
        backgroundColor: ThemeColors.CGREEN,
        alignItems: 'center',
        paddingHorizontal: ms(15),
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
    },
    midCont: {
        flex: 3,
        marginTop: vs(20),
    },
    card: (width, height) => ({
        width: width / 1.3,
        height: height / 4.5,
        borderRadius: ms(20),
        justifyContent: 'center',
        alignItems: 'center',
    }),
    textCont: {
        flexDirection: 'column',
        marginHorizontal: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: vs(2)
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        marginLeft: ms(5),
        // fontSize: 15,
        marginTop: vs(2),
        color: ThemeColors.GRAY,
    },
    mainCont: {
        flex: 1,
        // marginHorizontal: ms(15),
        // alignItems: 'center',
        // marginBottom: vs(5),
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
        height: height / 5,
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

