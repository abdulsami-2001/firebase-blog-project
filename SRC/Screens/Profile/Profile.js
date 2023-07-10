import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Button, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message'
import { Creators, Types } from '../../Redux/Action/Action'
import Lottie from 'lottie-react-native';
import { connect } from 'react-redux'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'

const Profile = ({ myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs, myallBlogs, allBlogs, myuserFavorites, userFavorites }) => {
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
                        <Lottie source={require('../../Assets/Lottie/profile.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                    </View>
                    <Text style={STYLES.heading}>Email: {user?.email}</Text>
                    <Text style={STYLES.heading}>User Verified: {user?.emailVerified ? "Yes" : "No"}</Text>
                </View>
                <Button mode="contained" style={STYLES.btn} onPress={() => singOutHandler()}>
                    Logout
                </Button>
            </View>
        )
    } else {
        return (
            <View style={STYLES.mainContNL}>

                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/profile.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.subContNL} >
                    <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.LOGIN)}>
                        Login
                    </Button>
                    <Button mode="contained" style={STYLES.btn} onPress={() => navigation.navigate(NavigationStrings.SIGNUP)}>
                        Signup
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
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    lottie: (width, height) => ({
        // backgroundColor: 'pink',
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
        alignItems: 'center'
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center'
    },
    myBlogsCont: {
        flex: 1
    },
    cardCont: {
        marginVertical: vs(5)
    },
    infoCont: {
        flexDirection: 'row'
    },
    btnCont: {
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 20,

    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    }
})




 // console.log("------------------")
    // console.log("user: ", user)
    // console.log("initializing: ", initializing)
    // console.log("isUserLoggedIn - Profile Screen: ", isUserLoggedIn)
    // console.log("userIdentification - Profile Screen: ", userIdentification)
    // console.log("------------------")

    // console.log("Creators ", Creators)
    // console.log("Types ", Types)
    //

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, [])
