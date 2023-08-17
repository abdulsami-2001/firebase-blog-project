import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { Avatar, Card, Text } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'

const ModifyBlog = ({ isUserLoggedIn, userIdentification, allBlogs, blogViewsCount, userLike, userComments, userBlogs, myallBlogs, myBlogViewsCount, myUserLike, myUserComments, myuserBlogs, }) => {
    const navigation = useNavigation()
    const { width, height } = Dimensions.get('screen')

    if (userIdentification) {
        return (
            <Text style={{ alignSelf: 'center' }} >Modification feature coming soon</Text>
        )
    } else {
        return (
            <View style={STYLES.mainContNL}>
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
    myallBlogs: Creators.allBlogs,
    myUserLike: Creators.userLike,
    myUserState: Creators.userState,
    myuserBlogs: Creators.userBlogs,
    myUserComments: Creators.userComments,
    myBlogViewsCount: Creators.blogViewsCount,
}

const mapStateToProps = (state) => {
    return {
        userBlogs: state.UserAuth.userBlogs,
        userLike: state.UserAuth.userLike,
        allBlogs: state.UserAuth.allBlogs,
        userComments: state.UserAuth.userComments,
        blogViewsCount: state.UserAuth.blogViewsCount,
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyBlog)


const STYLES = StyleSheet.create({
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
    headingCont: {
        marginVertical: vs(20),
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center',
        color: ThemeColors.GRAY,
    },
})