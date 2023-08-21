import { connect } from 'react-redux'
import Share from 'react-native-share';
import React, { useEffect, useState } from 'react'
import RenderHtml from 'react-native-render-html'
import { ms, s, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { Card, Text } from 'react-native-paper'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import Fontisto from 'react-native-vector-icons/Fontisto'
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { generateKey } from '../../Utils/ReusableFunctions/ReusableFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Modal, View, ScrollView, TextInput, useWindowDimensions } from 'react-native'

const HeaderComponent = ({ params, commentsForLength, Show, setShow, userIdentification, allBlogs, userLike, myUserLike, userComments, myUserComments, myallBlogs }) => {

    let tempIsfavorite = allBlogs[params]?.FavByUser?.includes(userIdentification) || false

    const [CommentText, setCommentText] = useState('')
    const { width } = useWindowDimensions();
    const [first, setfirst] = useState(true)
    const [Visible, setVisible] = useState(false)
    const [isFavorite, setisFavorite] = useState(tempIsfavorite)

    useEffect(() => {
        setfirst(!first)
    }, [userLike])

    // For Favorite feature
    // ----------------
    const iconPresHandler = (userUID, BlogId, isFavorite) => {
        if (userIdentification) {
            toggleFavorite(userUID, BlogId, isFavorite)
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

    const toggleFavorite = async (userUID, BlogId, isFavorite) => {
        showMessage({
            type: 'info',
            duration: 3000,
            message: "Favorites Updating",
        })
        try {
            const userRef = firestore().collection('Users').doc(userUID);
            const userDoc = await userRef.get();
            if (userDoc) {
                const userData = userDoc.data();
                const userPosts = userData[BlogId];
                if (userPosts) {
                    const favByUser = userPosts?.FavByUser || [];
                    if (!isFavorite) {
                        // Add UID to FavByUser array
                        if (!favByUser.includes(userIdentification)) {
                            favByUser.push(userIdentification);
                            myallBlogs({
                                ...allBlogs,
                                [params]: {
                                    Author: allBlogs[params]?.Author,
                                    Content: allBlogs[params]?.Content,
                                    BlogId: allBlogs[params]?.BlogId,
                                    ImageUrl: allBlogs[params]?.ImageUrl,
                                    Title: allBlogs[params]?.Title,
                                    uid: allBlogs[params]?.uid,
                                    FavByUser: favByUser,
                                }
                            })
                            setisFavorite(true)
                        }
                    } else {
                        // Remove UID from FavByUser array
                        const index = favByUser.indexOf(userIdentification);
                        if (index !== -1) {
                            favByUser.splice(index, 1);
                            myallBlogs({
                                ...allBlogs,
                                [params]: {
                                    Author: allBlogs[params]?.Author,
                                    Content: allBlogs[params]?.Content,
                                    BlogId: allBlogs[params]?.BlogId,
                                    ImageUrl: allBlogs[params]?.ImageUrl,
                                    Title: allBlogs[params]?.Title,
                                    uid: allBlogs[params]?.uid,
                                    FavByUser: favByUser,
                                }
                            })
                            setisFavorite(false)
                        }
                    }

                    // Update the post with the modified FavByUser array
                    await userRef.update({ [`${BlogId}.FavByUser`]: favByUser });
                    showMessage({
                        type: 'success',
                        duration: 3000,
                        message: "Favorites updated",
                    })
                } else {
                    showMessage({
                        type: 'warning',
                        duration: 3000,
                        message: "Unable to add to favorites",
                        description: 'Try again later - Userdocs'
                    })
                }
            } else {
                showMessage({
                    type: 'warning',
                    duration: 3000,
                    message: "Unable to add to favorites",
                    description: 'Try again later - Userdocs'
                })
            }
        } catch (error) {
            showMessage({
                type: 'warning',
                duration: 3000,
                message: "Unable to add to favorites",
                description: 'Try again later'
            })
            console.log('error on toggle fav', error)
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
            showMessage({
                message: "Blog Liking",
                type: "info",
            });
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
            showMessage({
                duration: 3000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
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
                        duration: 3000,
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
                duration: 3000,
                message: 'Error while liking blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const checkLikeByIdOnFirestore = async () => {
        try {
            const { _data: data } = await firestore()
                .collection('Like')
                .doc(allBlogs[params]?.BlogId).get()

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
            showMessage({
                duration: 3000,
                message: 'Error while Commenting',
                description: "Make sure you have working internet",
                type: 'warning'
            })
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
                        duration: 3000,
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
                duration: 3000,
                message: 'Error while liking blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }



    // For Comment feature
    // ----------------

    const commentPressHandler = (BlogId) => {
        if (userIdentification && CommentText != '') {
            getCommentsFromFirestore(BlogId)
        } else if (!userIdentification) {
            showMessage({
                message: "You're in guest mode",
                description: 'Do login/signup from profile',
                duration: 3000,
                type: 'warning'
            })
        } else if (CommentText == '') {
            showMessage({
                message: "Comment can't be empty",
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
            showMessage({
                message: "Commenting",
                type: "info",
            });
            let dataRef = firestore().collection('Comments');
            let snapshot = await dataRef?.get()
            let newComment = true
            snapshot.forEach(doc => {
                if (doc.id == BlogId) {
                    newComment = false
                }
            });
            newComment ? uploadCommentToFirestore() : updateCommentToFirestore()
            // newComment ? uploadCommentToFirestore() : checkCommentByIdOnFirestore()
        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }


    const uploadCommentToFirestore = async () => {

        let cmtid = generateKey(CommentText)

        try {
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
                        duration: 3000,
                        message: 'Comment Added',
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
                    setCommentText('')
                });
        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while commenting',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const updateCommentToFirestore = async (comment) => {
        let cmtid = generateKey(CommentText)

        try {
            firestore()
                .collection('Comments')
                .doc(allBlogs[params]?.BlogId)
                .update({
                    ...userComments[allBlogs[params]?.BlogId],
                    [userIdentification]: {
                        [cmtid]: {
                            cmt: CommentText
                        },
                        ...userComments[allBlogs[params]?.BlogId]?.[userIdentification],
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 3000,
                        message: 'Comment Added',
                        type: 'success'
                    })
                    myUserComments({
                        ...userComments,
                        [allBlogs[params]?.BlogId]: {
                            ...userComments[allBlogs[params]?.BlogId],
                            [userIdentification]: {
                                [cmtid]: {
                                    cmt: CommentText
                                },
                                ...userComments[allBlogs[params]?.BlogId]?.[userIdentification],
                            }
                        },
                    })
                    setCommentText('')
                });
        } catch (error) {
            showMessage({
                duration: 3000,
                message: 'Error while Commenting',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }


    // For Share feature
    // ----------------
    const sharePressHandler = () => {
        const options = {
            message: `Read a blog post *${allBlogs[params]?.Title}* on the blog app`,
            url: `Blog post poster: ${allBlogs[params]?.ImageUrl}`
        }

        Share.open(options)
            .then((res) => {
                return (
                    showMessage({
                        duration: 3000,
                        message: 'Blog post share successfully',
                        type: 'info',
                    })
                )
            })
            .catch((err) => {
                return (
                    showMessage({
                        duration: 3000,
                        message: 'Error during sharing the blog post',
                        description: 'Try again after reopening app',
                        type: 'warning',
                    })
                )
            });
    }


    return (
        <>
            {/* commeents modal */}
            <Modal
                animationType='slide'
                visible={Visible}
                transparent={true}
                style={STYLES.modal}
            >
                <TouchableOpacity style={STYLES.iconCont} activeOpacity={0.7} onPress={() => setVisible(false)}>
                    <MaterialCommunityIcons name='close' color={ThemeColors.WHITE} size={20} />
                </TouchableOpacity>
                <View style={STYLES.modalCont} >
                    <View style={STYLES.modalSubCont} >
                        {/* <Text>Hello from modal</Text> */}
                        <ImageViewer
                            imageUrls={[{ url: allBlogs[params]?.ImageUrl, }]}
                            enableSwipeDown
                            onSwipeDown={() => setVisible(false)}
                            backgroundColor={ThemeColors.BLACKOPACITY50}
                            enablePreload
                            loadingRender={() => (<Text>laoding...</Text>)}
                        />
                    </View>
                </View>
            </Modal>

            {/* cover, title, author */}
            <View style={STYLES.cardCont} >
                <Card style={STYLES.card} >
                    <View style={STYLES.header} >
                        <View style={STYLES.authorCont} >
                            <FontAwesome name={'user-circle'} size={40} />
                            <Text style={STYLES.authorText}>{allBlogs[params]?.Author}</Text>
                        </View>
                        <View style={STYLES.infoCont}>
                            <TouchableOpacity activeOpacity={0.7} style={STYLES.btnCont}  >
                                {isFavorite ?
                                    <MaterialIcons name='favorite' size={24} color={ThemeColors.CGREEN} onPress={() => iconPresHandler(allBlogs[params]?.uid, allBlogs[params]?.BlogId, isFavorite)} />
                                    :
                                    <MaterialIcons name='favorite-border' size={24} color={ThemeColors.CGREEN} onPress={() => iconPresHandler(allBlogs[params]?.uid, allBlogs[params]?.BlogId, isFavorite)} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={STYLES.imgCont} onPress={() => setVisible(true)}>
                        <Card.Cover source={{ uri: allBlogs[params]?.ImageUrl }} style={{ paddingHorizontal: ms(6) }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Card.Content style={STYLES.cardContent} >
                        <Text variant="titleLarge" style={STYLES.blogTitle}>{allBlogs[params]?.Title}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <RenderHtml
                                source={{ html: allBlogs[params]?.Content }}
                                contentWidth={width}
                            />
                        </ScrollView>

                    </Card.Content>
                </Card>
            </View>

            {/* like, cmt, share */}

            <Card style={{ marginBottom: vs(10) }}>
                <View style={STYLES.engagementCont(width)}>
                    {/* <View style={STYLES.engagementCont(width)} elevation={1} > */}
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
                    <TouchableOpacity onPress={() => setShow(!Show)} style={STYLES.engagementSubCont} >
                        <Fontisto name={'comments'} size={20} color={ThemeColors.CGREEN} />
                        <Text variant="titleSmall" style={STYLES.likeText} >{commentsForLength.length ? commentsForLength.length : 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sharePressHandler()} style={STYLES.engagementSubCont} >
                        <Fontisto name={'share'} size={20} color={ThemeColors.CGREEN} />
                    </TouchableOpacity>
                </View>
                <View style={STYLES.inputCont} >
                    <TextInput
                        style={STYLES.input(width)}
                        placeholder='Write a comment'
                        value={CommentText}
                        onChangeText={(text) => setCommentText(text)}
                    />
                    <TouchableOpacity onPress={() => commentPressHandler(allBlogs[params]?.BlogId)} >
                        <MaterialIcons name='send' size={25} color={ThemeColors.CGREEN} />
                    </TouchableOpacity>
                </View>
            </Card>
        </>
    )

}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myallBlogs: Creators.allBlogs,
    myUserLike: Creators.userLike,
    myUserComments: Creators.userComments,
    myallBlogs: Creators.allBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userLike: state.UserAuth.userLike,
        userComments: state.UserAuth.userComments,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)


const STYLES = StyleSheet.create({
    imgCont: {
        paddingTop: vs(6)
    },
    card: {
        marginBottom: ms(10),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: s(0.5),
        marginBottom: ms(3),
    },
    authorCont: {
        flexDirection: 'row',
        textAlign: 'justify',
        marginHorizontal: ms(5),
        marginVertical: vs(10),
        alignItems: 'center',
    },
    authorText: {
        paddingLeft: ms(8),
        fontWeight: 'bold',
        fontSize: s(18)
    },
    infoCont: {
        flexDirection: 'row',
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'justify',
    },
    blogTitle: {
        fontWeight: 'bold',
        fontSize: s(20),
        lineHeight: s(22),
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalCont: {
        flex: 1,
    },
    modalSubCont: {
        flex: 1,
        backgroundColor: ThemeColors.WHITE
    },
    cardContent: {
        paddingTop: ms(20),
    },
    iconCont: {
        position: 'absolute',
        zIndex: 1,
        top: 15,
        right: 5,
        backgroundColor: ThemeColors.CGREEN,
        borderRadius: 50,
    },
    cardCont: {
        marginVertical: vs(5),
    },
    cmntTextCont: (width) => ({
        marginLeft: ms(8),
        width: (width) - (width / 3),
        borderRadius: 10,
        padding: ms(5)
    }),
    cmnt: {
        marginVertical: vs(5),
        borderRadius: ms(15),
        paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        flexDirection: 'row',
        borderWidth: 1
    },
    commentSectionCont: {
        marginVertical: vs(5),
        padding: ms(10)
    },
    inputCont: {
        marginVertical: vs(5),
        padding: ms(5),
        // borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        // borderRadius: ms(10),
    },
    input: (width) => ({
        width: width - ms(90),
        borderWidth: 1,
        borderRadius: ms(10),
    }),
    likeText: {
        marginLeft: ms(10)
    },
    engagementSubCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(6),
    },
    engagementCont: (width) => ({
        // borderRadius: ms(10),
        flexDirection: 'row',
        paddingVertical: ms(5),
        paddingHorizontal: ms(10),
        // borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'space-between',
    }),
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(10),
    },
})