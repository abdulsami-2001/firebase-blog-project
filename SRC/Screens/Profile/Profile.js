import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters'
import React, { useState, useEffect } from 'react'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import { Button, Text, Card, Avatar } from 'react-native-paper'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'


const Profile = ({ myUserState, myUserId, myuserBlogs, userFromStore, myUser }) => {
    const navigation = useNavigation()
    const { width, height } = Dimensions.get('screen')
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
        setUser(user);
        if (user != null) {
            myUser(user)
        }
        if (initializing) setInitializing(false);
    }


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        return subscriber; // unsubscribe on unmount
    }, [user])

    const singOutHandler = async () => {
        showMessage({
            message: "Signing Out",
            type: "info",
            duration: 3000,
        })
        await auth()
            .signOut()
            .then(() => {
                showMessage({
                    message: "Signout Successfull",
                    type: "success",
                    duration: 3000,
                })
                myUserState(false)
                myUserId('')
                myuserBlogs({})
                myUser({})
            }
            ).catch(() => {
                showMessage({
                    message: "Signout Unsuccessfull",
                    type: "danger",
                    duration: 3000,
                })
            })
    }

    if (user != undefined && user != null) {
        return (
            <>
                <View style={STYLES.upperCont}>
                    <Card style={STYLES.card(width, height)}>
                        <TouchableOpacity onPress={() => { navigation.navigate(NavigationStrings.UPDATEPROFILE) }} activeOpacity={0.3}>
                            <Avatar.Icon size={30} color={ThemeColors.GRAY} icon={'pencil'} style={STYLES.editIcon} />
                        </TouchableOpacity>
                        {userFromStore?.photoURL != null ? <Image source={{ uri: userFromStore?.photoURL }} style={STYLES.profilePicture} /> : <Avatar.Icon size={100} color={ThemeColors.WHITE} style={STYLES.profileAvatar} icon={'account-circle'} />}
                        <View>
                            <Text style={{ ...STYLES.textBold, paddingLeft: 0, alignSelf: 'center' }} >{userFromStore?.displayName}</Text>
                            <Text style={{ ...STYLES.textBold, paddingLeft: 0, alignSelf: 'center' }} >{userFromStore?.email}</Text>
                            <Text style={STYLES.textNormal} >{userFromStore?.uid}</Text>
                        </View>
                    </Card>
                </View>
                <View style={STYLES.midCont}>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7}  >
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'login'} />
                        <View style={STYLES.timeCont}>
                            <Text style={STYLES.textBold} >Last login: </Text>
                            <Text style={STYLES.textNormal} >{new Date(user?.metadata?.lastSignInTime).toDateString()} {new Date(user?.metadata?.lastSignInTime).toLocaleTimeString()}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7} >
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'clock-time-three'} />
                        <View style={STYLES.timeCont}>
                            <Text style={STYLES.textBold} >Account creation:</Text>
                            <Text style={STYLES.textNormal} >{new Date(user?.metadata?.creationTime).toDateString()} {new Date(user?.metadata?.creationTime).toLocaleTimeString()}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.VERIFYEMAIL)}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'email-check'} />
                        <Text style={STYLES.textBold} >Verify email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.CHANGEPASSWORD)}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'key-arrow-right'} />
                        <Text style={STYLES.textBold} >Change password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={STYLES.cont} activeOpacity={0.7} onPress={() => singOutHandler()}>
                        <Avatar.Icon size={50} color={ThemeColors.WHITE} style={STYLES.bottomAvatar} icon={'logout'} />
                        <Text style={STYLES.textBold} >Signout</Text>
                    </TouchableOpacity>
                </View>
            </>
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
    myallBlogs: Creators.allBlogs,
    myUser: Creators.user,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFromStore: state.UserAuth.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const STYLES = StyleSheet.create({
    textNormal: {
        paddingLeft: ms(10),
        fontSize: ms(11),
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: ms(14),
        paddingLeft: ms(10),
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: ms(50),
        alignSelf: 'center',
    },
    profileAvatar: {
        backgroundColor: ThemeColors.CGREEN,
        alignSelf: 'center',
    },
    editIcon: {
        backgroundColor: 'transparent',
        alignSelf: 'flex-end'
    },
    bottomAvatar: {
        backgroundColor: ThemeColors.CGREEN
    },
    cont: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(10),
        paddingVertical: vs(4),
        marginBottom: vs(3),
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
        height: height / 3.5,
        borderRadius: ms(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ThemeColors.WHITE
    }),
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
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN,
    }
})

