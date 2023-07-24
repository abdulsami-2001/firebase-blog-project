import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import RenderHtml from 'react-native-render-html'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { Card, Surface, Text } from 'react-native-paper'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import Fontisto from 'react-native-vector-icons/Fontisto'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet, TouchableOpacity, View, ScrollView, TextInput, useWindowDimensions } from 'react-native'

const HeaderComponent = ({ params, userIdentification, allBlogs, myuserFavorites, userFavorites, userLike, myUserLike, userComments, myUserComments }) => {
    const [CommentText, setCommentText] = useState('')
    const { width } = useWindowDimensions();
    const isLoved = false
    const [first, setfirst] = useState(true)


    useEffect(() => {
        setfirst(!first)
    }, [userLike])

    // For Favorite feature
    // ----------------
    const iconPresHandler = () => {
        if (userIdentification) {
            getFavoritesFromFirestore()
        } else if (!userIdentification) {
            showMessage({
                message: "You're in guest mode",
                description: 'Do login/signup from profile',
                duration: 3000,
                type: 'warning'
            })
        } else {
            showMessage({
                message: 'Something went wrong',
                description: 'Restart the app',
                type: 'warning'
            })
        }
    }

    const getFavoritesFromFirestore = async () => {
        try {
            let dataRef = firestore().collection('Favorites');
            let snapshot = await dataRef?.get()
            let newUser = true
            snapshot.forEach(doc => {
                if (doc.id == userIdentification) {
                    newUser = false
                }
            });

            newUser ? uploadFavoritesToFirestore() : updateFavoritesToFirestore()

        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    const uploadFavoritesToFirestore = async () => {
        try {
            firestore()
                .collection('Favorites')
                .doc(userIdentification)
                .set({
                    [params]: allBlogs[params],
                    ...userFavorites,
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Favorites Added',
                        type: 'success'
                    })
                    myuserFavorites({
                        [params]: allBlogs[params],
                        ...userFavorites,
                    })
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while updating favorite',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const updateFavoritesToFirestore = async () => {
        try {
            firestore()
                .collection('Favorites')
                .doc(userIdentification)
                .update({
                    [params]: allBlogs[params],
                    ...userFavorites,
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Favorite updated',
                        type: 'success'
                    })
                    myuserFavorites({
                        [params]: allBlogs[params],
                        ...userFavorites,
                    })
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while updating favorite',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }


    // For Like feature
    // ----------------

    const likePressHandler = (BlogId) => {
        if (userIdentification) {
            getLikeFromFirestore(BlogId)
        } else if (!userIdentification) {
            showMessage({
                message: "You're in guest mode",
                description: 'Do login/signup from profile',
                duration: 3000,
                type: 'warning'
            })
        } else {
            showMessage({
                message: 'Something went wrong',
                description: 'Restart the app',
                type: 'warning'
            })
        }
    }

    const getLikeFromFirestore = async (BlogId) => {
        try {
            let dataRef = firestore().collection('Like');
            let snapshot = await dataRef?.get()
            let newLike = true
            snapshot.forEach(doc => {
                if (doc.id == BlogId) {
                    newLike = false
                }
            });
            newLike ? uploadLikeToFirestore() : checkLikeByIdOnFirestore()
        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    const checkLikeByIdOnFirestore = async () => {
        try {
            const { _data: data } = await firestore()
                .collection('Like')
                .doc(allBlogs[params]?.BlogId).get()

            // console.log(userLike)
            let liked = false; // not liked by user
            let usrIdArray = [...data?.LikedByUsers]
            usrIdArray.push(userIdentification)

            data?.LikedByUsers.map((item) => {
                if (item == userIdentification) {
                    liked = true // found on server that blog is already liked 
                    // now further we going to dislike the blog
                    usrIdArray = data?.LikedByUsers.filter((item) => {
                        return item != userIdentification
                    })
                }
            })

            liked ? updateLikeToFirestore(liked, usrIdArray) : updateLikeToFirestore(liked, usrIdArray)

        } catch (error) {
            console.log("error on checkLikeByIdOnFirestore ", error)
        }
    }

    const updateLikeToFirestore = async (liked, usrIdArray) => {
        try {
            firestore()
                .collection('Like')
                .doc(allBlogs[params]?.BlogId)
                .update({ //plus one hogi ya minus
                    LikedByUsers: usrIdArray,
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Like/dislike update',
                        type: 'success'
                    })
                    myUserLike({
                        ...userLike,
                        [allBlogs[params]?.BlogId]: {
                            LikedByUsers: usrIdArray,
                        },
                    })
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while liking blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const uploadLikeToFirestore = async () => {
        try {
            firestore()
                .collection('Like')
                .doc(allBlogs[params]?.BlogId)
                .set({
                    LikedByUsers: [userIdentification],
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Blog Liked',
                        type: 'success'
                    })
                    myUserLike({
                        ...userLike,
                        [allBlogs[params]?.BlogId]: {
                            LikedByUsers: [userIdentification],
                        },
                    })
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while liking blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }


    // For Comment feature
    // ----------------

    const commentPressHandler = (BlogId) => {
        console.log('BlogId', BlogId)
        if (userIdentification) {
            // getCommentFromFirestore(BlogId)
            getCommentsFromFirestore(BlogId)
        } else if (!userIdentification) {
            showMessage({
                message: "You're in guest mode",
                description: 'Do login/signup from profile',
                duration: 3000,
                type: 'warning'
            })
        } else {
            showMessage({
                message: 'Something went wrong',
                description: 'Restart the app',
                type: 'warning'
            })
        }
    }

    const getCommentsFromFirestore = async (BlogId) => {
        try {
            let dataRef = firestore().collection('Comments');
            let snapshot = await dataRef?.get()
            let newComment = true
            snapshot.forEach(doc => {
                if (doc.id == BlogId) {
                    newComment = false
                }
            });
            console.log('getCommentsFromFirestore')
            newComment ? uploadCommentToFirestore() : console.log('idhr')
            // newComment ? uploadCommentToFirestore() : checkCommentByIdOnFirestore()
        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    const generateCommentId = (cmt) => {
        return `${cmt}_${new Date().getTime()}`;

    }

    const uploadCommentToFirestore = async () => {

        let cmtid = generateCommentId(CommentText.substring(0, 5))

        try {
            console.log('uploadCommentToFirestore')
            firestore()
                .collection('Comments')
                .doc(allBlogs[params]?.BlogId)
                .set({ //adding userid with its comments also generating commentid
                    [userIdentification]: {
                        [cmtid]: {
                            cmt: CommentText
                        }
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Like/dislike update',
                        type: 'success'
                    })
                    myUserComments({
                        ...userComments,
                        [allBlogs[params]?.BlogId]: {
                            [userIdentification]: {
                                [cmtid]: {
                                    cmt: CommentText
                                }
                            }
                        }
                    })
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while liking blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const checkCommentByIdOnFirestore = async () => {
        try {
            const { _data: data } = await firestore()
                .collection('Comments')
                .doc(allBlogs[params]?.BlogId).get()

            // console.log(userLike)
            let liked = false; // not liked by user
            let usrIdArray = [...data?.LikedByUsers]
            usrIdArray.push(userIdentification)

            data?.LikedByUsers.map((item) => {
                if (item == userIdentification) {
                    liked = true // found on server that blog is already liked 
                    // now further we going to dislike the blog
                    usrIdArray = data?.LikedByUsers.filter((item) => {
                        return item != userIdentification
                    })
                }
            })

            // liked ? updateLikeToFirestore(liked, usrIdArray) : updateLikeToFirestore(liked, usrIdArray)

        } catch (error) {
            console.log("error on checkLikeByIdOnFirestore ", error)
        }
    }








    // For Share feature
    // ----------------
    const sharePressHandler = () => {
        showMessage({
            duration: 2000,
            message: 'Share feature will implement soon',
            type: 'info',
        })
    }


    return (
        <>
            <View style={STYLES.cardCont} >
                <Card.Cover source={{ uri: allBlogs[params]?.ImageUrl }} resizeMode='contain' />
                <Card.Content>
                    <Text variant="titleLarge">{allBlogs[params]?.Title}</Text>
                    <ScrollView horizontal >
                        <RenderHtml
                            source={{ html: allBlogs[params]?.Content }}
                            contentWidth={width}
                        />
                    </ScrollView>
                    <View style={STYLES.infoCont}>
                        <View>
                            <Text variant="titleSmall">Author: {allBlogs[params]?.Author}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={STYLES.btnCont}  >
                            {isLoved ?
                                <MaterialIcons name='favorite' size={24} color={ThemeColors.CGREEN} />
                                :
                                <MaterialIcons name='favorite-border' size={24} color={ThemeColors.CGREEN} onPress={() => iconPresHandler()} />
                            }
                        </TouchableOpacity>
                    </View>
                    <Surface style={STYLES.engagementCont} elevation={1} >
                        <TouchableOpacity onPress={() => likePressHandler(allBlogs[params]?.BlogId)} style={STYLES.engagementSubCont} >
                            {userLike[allBlogs[params]?.BlogId]?.LikedByUsers?.find((item) => item == userIdentification) ?
                                (
                                    <AntDesign name={'like1'} size={22} color={ThemeColors.CGREEN} />
                                ) : (
                                    <AntDesign name={'like2'} size={22} color={ThemeColors.CGREEN} />
                                )
                            }
                            <Text variant="titleSmall" style={STYLES.likeText} >{userLike[allBlogs[params]?.BlogId]?.LikedByUsers.length ? userLike[allBlogs[params]?.BlogId]?.LikedByUsers.length : 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => commentPressHandler(allBlogs[params]?.BlogId)} style={STYLES.engagementSubCont} >
                            <Fontisto name={'comments'} size={20} color={ThemeColors.CGREEN} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sharePressHandler()} style={STYLES.engagementSubCont} >
                            <Fontisto name={'share'} size={20} color={ThemeColors.CGREEN} />
                        </TouchableOpacity>
                    </Surface>
                </Card.Content>
            </View>
            <Surface style={STYLES.inputCont} >
                <TextInput
                    style={STYLES.input(width)}
                    placeholder='Write a comment'
                    value={CommentText}
                    onChangeText={(text) => setCommentText(text)}
                />
                <TouchableOpacity onPress={() => commentPressHandler(allBlogs[params]?.BlogId)} >
                    <MaterialIcons name='send' size={25} color={ThemeColors.CGREEN} />
                </TouchableOpacity>
            </Surface>
        </>
    )

}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myuserFavorites: Creators.userFavorites,
    myallBlogs: Creators.allBlogs,
    myUserLike: Creators.userLike,
    myUserComments: Creators.userComments,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFavorites: state.UserAuth.userFavorites,
        userLike: state.UserAuth.userLike,
        userComments: state.UserAuth.userComments,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)


const STYLES = StyleSheet.create({
    cardCont: {
        marginVertical: vs(5)
    },
    cmntText: {
    },
    cmntTextCont: (width) => ({
        marginLeft: ms(8),
        width: (width) - (width / 3),
        // backgroundColor: 'red',
        borderRadius: 10,
        padding: ms(5)
    }),
    cmnt: {
        marginVertical: vs(5),
        // backgroundColor: 'red',
        borderRadius: ms(15),
        paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        flexDirection: 'row',
        // alignItems: 'center',
        borderWidth: 1
    },
    commentSectionCont: {
        marginVertical: vs(5),
        padding: ms(10)
    },
    inputCont: {
        marginTop: vs(5),
        padding: ms(5),
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: ms(10),
    },
    input: (width) => ({
        // height: vs(35),
        // backgroundColor: 'orange',
        width: width - ms(90),
        borderWidth: 1,
        borderRadius: ms(10),
    }),
    infoCont: {
        flexDirection: 'row',
        marginVertical: vs(4)
    },
    likeText: {
        marginLeft: ms(10)
    },
    engagementSubCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(6),
    },
    engagementCont: {
        borderRadius: ms(15),
        flexDirection: 'row',
        paddingVertical: ms(5),
        paddingHorizontal: ms(10),
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(10),
    },
})