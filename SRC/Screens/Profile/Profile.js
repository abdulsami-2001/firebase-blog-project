import { View, StyleSheet, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Button, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message'
import { Creators } from '../../Redux/Action/Action'
import { connect } from 'react-redux'

const Profile = ({ myUserState, isUserLoggedIn }) => {
    const navigation = useNavigation()

    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    console.log("------------------")
    console.log("user: ", user)
    console.log("initializing: ", initializing)
    console.log("isUserLoggedIn ", isUserLoggedIn)
    console.log("------------------")

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, [])

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
                    <Text style={STYLES.heading}>Profile</Text>
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
                <Text style={STYLES.heading} >You're Not Logged In.</Text>
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
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn
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
    },
    subContNL: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
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
        marginVertical: vs(3)
    }
})