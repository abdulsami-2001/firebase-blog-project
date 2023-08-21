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

const MyBlogs = ({ isUserLoggedIn, userIdentification, allBlogs, blogViewsCount, userLike, userComments, userBlogs, myallBlogs, myBlogViewsCount, myUserLike, myUserComments, myuserBlogs }) => {
    const navigation = useNavigation()
    const [first, setfirst] = useState(true)
    const { width, height } = Dimensions.get('screen')
    let BlogData = Object.keys(userBlogs)


    useEffect(() => {
        setfirst(!first)
    }, [userBlogs, userIdentification, isUserLoggedIn, blogViewsCount])


    const postViews = {}; // Object to store total views for each post

    for (const postId in blogViewsCount) {
        postViews[postId] = 0; // Initialize total views for this post

        for (const userId in blogViewsCount[postId]) {
            postViews[postId] += blogViewsCount[postId][userId].ViewsCount;
        }
    }

    // giving function a blogsData object with id of the blog to remove/delete from it and retruning the filtered data.
    const filteredData = (blogsData, blogWithout_IdToDelete, blogWith_IdToDelete) => {
        if (blogWithout_IdToDelete) {
            const updatedBlogsData = Object.keys(blogsData)
                .filter(blogId => blogId != blogWithout_IdToDelete);

            const finalData = updatedBlogsData.reduce((newBlogsData, blogId) => {
                newBlogsData[blogId] = blogsData[blogId];
                return newBlogsData;
            }, {});

            return finalData
        } else if (blogWith_IdToDelete) {
            const updatedBlogsData = Object.keys(blogsData)
                .filter(blogId => blogId != blogWith_IdToDelete);

            const finalData = updatedBlogsData.reduce((newBlogsData, blogId) => {
                newBlogsData[blogId] = blogsData[blogId];
                return newBlogsData;
            }, {});

            return finalData
        } else {
            console.log('error on filtered data function')
        }

    }


    //update 'User' collection on firebase and also redux store.
    const blogDeleteHandler = (blogWithout_IdToDelete, blogWith_IdToDelete) => {
        const singleUserData = filteredData(userBlogs, blogWithout_IdToDelete, false)
        const allBlogsData = filteredData(allBlogs, blogWithout_IdToDelete, false)
        const blogViewsCountData = filteredData(blogViewsCount, false, blogWith_IdToDelete)
        const userLikeData = filteredData(userLike, false, blogWith_IdToDelete)
        const userCommentsData = filteredData(userComments, false, blogWith_IdToDelete)

        showMessage({
            duration: 3000,
            message: 'Blog Deleting',
            type: 'info'
        })

        try {
            firestore()
                .collection('Users')
                .doc(userIdentification)
                .set({
                    ...singleUserData
                })
                .then(() => {
                    myuserBlogs({ ...singleUserData })
                    myallBlogs({ ...allBlogsData })

                    deleteBlogViewsCountData(blogViewsCountData, blogWith_IdToDelete)
                    deleteUserLikeDataData(userLikeData, blogWith_IdToDelete)
                    deleteUserCommentsData(userCommentsData, blogWith_IdToDelete)

                    showMessage({
                        duration: 3000,
                        message: 'Blog Deleted',
                        type: 'success'
                    })
                });
        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while deleting blog - User Blog',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    //update 'BlogViewsCount' collection on firebase and also redux store.
    const deleteBlogViewsCountData = async (blogViewsCountData, blogWith_IdToDelete) => {
        const documentRef = firestore().collection('BlogViewsCount').doc(blogWith_IdToDelete);

        documentRef.delete()
            .then(() => {
                myBlogViewsCount({ ...blogViewsCountData })
            })
            .catch(error => {
                showMessage({
                    duration: 3000,
                    message: 'Error while deleting blog - Blog Views Count',
                    description: "Make sure you have working internet",
                    type: 'warning'
                })
            });
    }

    //update 'Like' collection on firebase and also redux store.
    const deleteUserLikeDataData = async (userLikeData, blogWith_IdToDelete) => {
        const documentRef = firestore().collection('Like').doc(blogWith_IdToDelete);

        documentRef.delete()
            .then(() => {
                myUserLike({ ...userLikeData })
            })
            .catch(error => {
                showMessage({
                    duration: 3000,
                    message: 'Error while deleting blog - User Like',
                    description: "Make sure you have working internet",
                    type: 'warning'
                })
            });
    }

    //update 'Comments' collection on firebase and also redux store.
    const deleteUserCommentsData = async (userCommentsData, blogWith_IdToDelete) => {
        const documentRef = firestore().collection('Comments').doc(blogWith_IdToDelete);

        documentRef.delete()
            .then(() => {
                myUserComments({ ...userCommentsData })
            })
            .catch(error => {
                showMessage({
                    duration: 3000,
                    message: 'Error while deleting blog - User Comments',
                    description: "Make sure you have working internet",
                    type: 'warning'
                })
            });
    }


    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <TouchableOpacity style={STYLES.btnCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG)}>
                    <AntDesign name='pluscircle' color={ThemeColors.CGREEN} size={50} />
                </TouchableOpacity>
                <View style={STYLES.myBlogsCont}>
                    <FlatList
                        data={BlogData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <>
                                    <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                        <Card>
                                            <Card.Cover source={{ uri: userBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                            <View style={STYLES.iconCont} >
                                                <TouchableOpacity style={STYLES.editIconCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG, { editItem: item, editImageUrl: userBlogs[item]?.ImageUrl, editTitle: userBlogs[item]?.Title, editBlogId: userBlogs[item]?.BlogId, editAuthor: userBlogs[item]?.Author, editContent: userBlogs[item]?.Content, editFavByUser: allBlogs[item]?.FavByUser, editUserIdentification: userBlogs[item]?.uid })}>
                                                    <Avatar.Icon size={30} color={ThemeColors.WHITE} icon={'pencil'} style={STYLES.editIcon} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={STYLES.editIconCont} onPress={() => blogDeleteHandler(item, userBlogs[item]?.BlogId)} >
                                                    <Avatar.Icon size={30} color={ThemeColors.WHITE} icon={'delete'} style={STYLES.editIcon} />
                                                </TouchableOpacity>
                                            </View>
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
                                </>
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
                    <AntDesign name='pluscircle' color={ThemeColors.CGREEN} size={50} />
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

export default connect(mapStateToProps, mapDispatchToProps)(MyBlogs)

const STYLES = StyleSheet.create({
    iconCont: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    editIcon: {
        backgroundColor: 'transparent',
    },
    editIconCont: {
        backgroundColor: ThemeColors.CGREEN,
        borderRadius: ms(10),
        padding: ms(3),
        marginTop: vs(4),
        marginLeft: ms(5),
    },
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
        backgroundColor: ThemeColors.WHITE,
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