import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { Avatar, Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'

const MyBlogs = ({ isUserLoggedIn, userIdentification, userBlogs, allBlogs, blogViewsCount }) => {
    const navigation = useNavigation()
    const [first, setfirst] = useState(true)
    const { width, height } = Dimensions.get('screen')
    let BlogData = Object.keys(userBlogs)


    useEffect(() => {
        setfirst(!first)
    }, [userBlogs, userIdentification, isUserLoggedIn])


    const postViews = {}; // Object to store total views for each post

    for (const postId in blogViewsCount) {
        postViews[postId] = 0; // Initialize total views for this post

        for (const userId in blogViewsCount[postId]) {
            postViews[postId] += blogViewsCount[postId][userId].ViewsCount;
        }
    }

    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <TouchableOpacity style={STYLES.btnCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG)}>
                    <AntDesign name='pluscircle' color={ThemeColors.WHITE} size={50} />
                </TouchableOpacity>
                <View style={STYLES.myBlogsCont}>
                    <FlatList
                        data={BlogData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                    <Card>
                                        <Card.Cover source={{ uri: userBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                        <Card.Content>
                                            <Text variant="titleLarge" style={STYLES.textHeading} >{userBlogs[item]?.Title}</Text>
                                            <Text variant="bodyMedium" style={STYLES.text}>Tap to read</Text>
                                            <View style={STYLES.authorCont} >
                                                <Text variant="titleSmall" style={STYLES.textHeading}>Author: </Text>
                                                <Text style={STYLES.text}>{userBlogs[item]?.Author}</Text>
                                            </View>
                                            <View style={STYLES.blogViewCont} >
                                                <Text variant="titleSmall" style={{ ...STYLES.textHeading, fontSize: 15 }}>Blog views: </Text>
                                                <Text style={{ ...STYLES.text, marginLeft: ms(3) }}>{postViews[userBlogs[item]?.BlogId] || 0}</Text>
                                                <Avatar.Icon size={25} color={ThemeColors.CGREEN} icon={'eye-outline'} style={STYLES.eyeIcon} />
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View >
        )
    } else if (isUserLoggedIn && BlogData.length <= 0) {
        return (
            <View style={STYLES.mainContNL}>
                <TouchableOpacity style={STYLES.btnCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG)}>
                    <AntDesign name='pluscircle' color={ThemeColors.WHITE} size={50} />
                </TouchableOpacity>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading}  >You didn't write any blogs.</Text>
                </View>
            </View>
        )
    }
    else {
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
    myUserState: Creators.userState,
    myallBlogs: Creators.allBlogs,
    myuserBlogs: Creators.userBlogs,
    myBlogViewsCount: Creators.blogViewsCount,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
        userBlogs: state.UserAuth.userBlogs,
        allBlogs: state.UserAuth.allBlogs,
        blogViewsCount: state.UserAuth.blogViewsCount,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBlogs)

const STYLES = StyleSheet.create({
    eyeIcon: {
        backgroundColor: 'transparent',
        paddingTop: vs(3),
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
    subContNL: {
        justifyContent: 'space-evenly',
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
    myBlogsCont: {
        flex: 1
    },
    cardCont: (width) => ({
        marginVertical: vs(5),
        width: width - ms(30),
    }),
    btnCont: {
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 20,
        backgroundColor: ThemeColors.CGREEN,
        borderRadius: 30,
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        color: ThemeColors.GRAY,
        fontSize: 15,
    },
    authorCont: {
        flexDirection: 'row',
        marginTop: vs(4)
    },
    blogViewCont: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})