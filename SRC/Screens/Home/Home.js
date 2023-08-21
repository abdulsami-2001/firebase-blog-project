import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { Creators } from '../../Redux/Action/Action'
import { ms, s, vs } from 'react-native-size-matters'
import { Card, Text, Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'

const Home = ({ userBlogs, myallBlogs, allBlogs, userLike, myUserLike, userComments, myUserComments, blogViewsCount, myBlogViewsCount, }) => {
    const navigation = useNavigation()
    let BlogData = Object.keys(allBlogs)
    const { width } = Dimensions.get('screen')

    useEffect(() => {
        getDataFromFirestore()
    }, [userBlogs])

    useEffect(() => {
        getLikeFromFirestore()
        getCommentsFromFirestore()
        getblogViewsCountFromFirestore()
    }, [])


    // user data from firebase firestore
    const getDataFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('Users');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                datatemp = { ...tempdoc, ...datatemp }
            });

            myallBlogs({ ...datatemp })

        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }
    // Likes data from firebase firestore
    const getLikeFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('Like');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                let anotherTemp = doc.id
                datatemp = { [anotherTemp]: tempdoc, ...datatemp }
            });

            myUserLike({ ...datatemp })

        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while fetching blog likes',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    // comments data from firebase firestore
    const getCommentsFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('Comments');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                let anotherTemp = doc.id
                datatemp = { [anotherTemp]: tempdoc, ...datatemp }
            });
            myUserComments({ ...datatemp })

        } catch (error) {
            showMessage({
                duration: 3000,
                message: "Unable to fetch your blogs",
                description: 'Make sure internet is working',
                type: 'warning',
            })
        }
    }


    const getblogViewsCountFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('BlogViewsCount');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                let anotherTemp = doc.id
                datatemp = { [anotherTemp]: tempdoc, ...datatemp }
            });
            myBlogViewsCount({ ...datatemp })

        } catch (error) {
            showMessage({
                duration: 3000,
                message: "Unable to fetch blog views",
                description: 'Make sure internet is working',
                type: 'warning',
            })
        }
    }

    return (
        <View style={STYLES.mainCont}>
            <View style={STYLES.subCont}>
                <FlatList
                    data={BlogData}
                    key={Math.random()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.95} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                <Card>
                                    <Card.Cover source={{ uri: allBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                    <Card.Content style={STYLES.cardContent} >
                                        <Text variant="titleLarge" style={STYLES.blogTitle}>{allBlogs[item]?.Title}</Text>
                                        {/* <Text variant="titleLarge" style={STYLES.blogTitle}>How you can make {allBlogs[item]?.Title} tool, using free resources which is available on internet</Text> */}
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
                    }}
                />
            </View>
        </View>
    )
}

const mapDispatchToProps = {
    myUserId: Creators.userId,
    myallBlogs: Creators.allBlogs,
    myUserLike: Creators.userLike,
    myuserBlogs: Creators.userBlogs,
    myUserState: Creators.userState,
    myUserComments: Creators.userComments,
    myBlogViewsCount: Creators.blogViewsCount,
}

const mapStateToProps = (state) => {
    return {
        userBlogs: state.UserAuth.userBlogs,
        allBlogs: state.UserAuth.allBlogs,
        userLike: state.UserAuth.userLike,
        userComments: state.UserAuth.userComments,
        blogViewsCount: state.UserAuth.blogViewsCount,
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    cardCont: (width) => ({
        marginVertical: vs(5),
        width: width - ms(30)
    }),
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: ms(20),
    },
    authorCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'justify',
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'justify',
        alignItems: 'center',
        alignContent: 'center',
    },
    blogTitle: {
        fontWeight: 'bold',
        fontSize: s(20),
        lineHeight: s(22),
        textAlign: 'justify',
        textAlignVertical: 'center',
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
    }
})

