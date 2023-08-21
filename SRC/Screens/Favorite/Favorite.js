import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import { Card, Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { Creators } from '../../Redux/Action/Action'
import { ms, s, vs } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'

const Favorite = ({ isUserLoggedIn, userIdentification, allBlogs }) => {
    const { width, height } = Dimensions.get('screen')
    const navigation = useNavigation()
    const [first, setfirst] = useState(true)

    useEffect(() => {
        setfirst(!first)
    }, [userIdentification, isUserLoggedIn])

    // favorites population krni ha


    const getFavoritedPostsByUserId = (allBlogs, userIdentification) => {
        const favoritedPosts = {};

        for (const blogId in allBlogs) {
            const post = allBlogs[blogId];
            if (post?.FavByUser?.includes(userIdentification)) {
                favoritedPosts[blogId] = post;
            }
        }

        return favoritedPosts;
    }

    let favoritedPosts = getFavoritedPostsByUserId(allBlogs, userIdentification)

    let BlogData = Object.keys(favoritedPosts)


    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)}>
                                <Card>
                                    <Card.Cover source={{ uri: allBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                    <Card.Content style={STYLES.cardContent} >
                                        <Text variant="titleLarge" style={STYLES.blogTitle} >{allBlogs[item]?.Title}</Text>
                                        <View style={STYLES.tapCont}>
                                            <Text variant="bodyMedium" style={STYLES.text}>Press to read</Text>
                                            <FontAwesome5 name={'hand-pointer'} style={STYLES.tapIcon} size={20} color={ThemeColors.CGREEN} />
                                        </View>
                                        <View style={STYLES.authorCont} >
                                            <Text variant="titleSmall" style={STYLES.textHeading}>Author: </Text>
                                            <Text style={STYLES.text2}>{allBlogs[item]?.Author}</Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )
                    }
                    }
                />
            </View>
        )
    } else if (isUserLoggedIn && BlogData.length <= 0) {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading}>You don't have favorite blogs.</Text>
                </View>
            </View>
        )
    }
    else {
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

export default connect(mapStateToProps, mapDispatchToProps)(Favorite)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginVertical: 5,
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
    authorCont: {
        flexDirection: 'row',
    },
    cardCont: (width) => ({
        marginVertical: 5,
        width: width - ms(30)
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
    textHeading: {
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'justify',
        alignItems: 'center',
        alignContent: 'center',
    },
    text: {
        color: ThemeColors.GRAY,
        fontSize: 15,
        paddingVertical: ms(8),
    },
    tapCont: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },
    tapIcon: {
        paddingLeft: ms(3),
    },
    blogTitle: {
        fontWeight: 'bold',
        fontSize: s(20),
        lineHeight: s(22),
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: ms(20),
    },
})