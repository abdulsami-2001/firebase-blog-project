import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Creators } from '../../Redux/Action/Action'
import { ms, s, vs } from 'react-native-size-matters'
import { Card, Text, Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { StyleSheet, View, FlatList, TouchableOpacity, useWindowDimensions, Image } from 'react-native'

const Home = ({ userBlogs, myallBlogs, allBlogs, userLike, myUserLike, userComments, myUserComments, blogViewsCount, myBlogViewsCount, usersData, myUsersData }) => {
    const navigation = useNavigation()
    let BlogData = Object.keys(allBlogs)
    // const { width } = Dimensions.get('screen')
    const { width } = useWindowDimensions()

    useEffect(() => {
        getDataFromFirestore()
    }, [userBlogs])

    useEffect(() => {
        getUsersDataFromFirestore()
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

    //blog views from firebae
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

    // getting all users name, profile, so that it can be displayed on everywhere when user comments or posts.
    const getUsersDataFromFirestore = async () => {
        try {
            const usersRef = firestore().collection('UsersData');
            const snapshot = await usersRef.get();

            const fetchedUsers = {};
            snapshot.forEach(doc => {
                fetchedUsers[doc.id] = doc.data();
            });

            myUsersData(fetchedUsers)
        } catch (error) {
            showMessage({
                duration: 3000,
                message: "Unable to fetch users display names and profile pictures.",
                description: 'Make sure internet is working',
                type: 'warning',
            })
            console.error('Error fetching users data:', error);
        }
    };

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
                                <Card style={STYLES.card} elevation={1} >
                                    <View style={STYLES.header} >
                                        <View style={STYLES.authorCont} >
                                            {usersData[allBlogs[item]?.uid]?.photoURL ?
                                                <Image source={{ uri: usersData[allBlogs[item]?.uid]?.photoURL }} style={STYLES.authorImg} />
                                                :
                                                <FontAwesome name={'user-circle'} size={40} />
                                            }
                                            <Text style={STYLES.authorText}>{allBlogs[item]?.Author}</Text>
                                        </View>
                                    </View>
                                    <Card.Cover style={STYLES.coverImg} source={{ uri: allBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                    <Card.Content style={STYLES.cardContent} >
                                        <Text variant="titleLarge" style={STYLES.blogTitle}>{allBlogs[item]?.Title}</Text>
                                        {/* <Text variant="titleLarge" style={STYLES.blogTitle}>How you can make {allBlogs[item]?.Title} tool, using free resources which is available on internet</Text> */}
                                        <View style={STYLES.tapCont}>
                                            <Text variant="bodyMedium" style={STYLES.text}>Press to read</Text>
                                            <FontAwesome5 name={'hand-pointer'} style={STYLES.tapIcon} size={20} color={ThemeColors.BLACK} />
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
    myUsersData: Creators.usersData,
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
        usersData: state.UserAuth.usersData,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const STYLES = StyleSheet.create({
    authorImg: {
        width: 40,
        height: 40,
        borderRadius: ms(25),
    },
    authorText: {
        paddingLeft: ms(8),
        fontWeight: 'bold',
        fontSize: s(18)
    },
    coverImg: {
        paddingHorizontal: ms(6),
        backgroundColor: ThemeColors.WHITE,
        paddingTop: vs(6),
    },
    card: {
        borderRadius: ms(2),
        backgroundColor: ThemeColors.WHITE,
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: s(0.5),
        marginBottom: ms(3),
    },
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(15),
        paddingVertical: vs(5),
        backgroundColor: ThemeColors.LIGHTGRAY,
    },
    cardCont: (width) => ({
        marginVertical: vs(2),
        width: width - ms(30)
    }),
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: ms(20),
    },
    authorCont: {
        flexDirection: 'row',
        textAlign: 'justify',
        marginHorizontal: ms(5),
        marginVertical: vs(10),
        alignItems: 'center',
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

