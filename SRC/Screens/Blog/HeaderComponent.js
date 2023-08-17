import { connect } from 'react-redux'
import Share from 'react-native-share';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Modal, View, ScrollView, TextInput, useWindowDimensions } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';

const HeaderComponent = ({ params, commentsForLength, Show, setShow, userIdentification, allBlogs, userLike, myUserLike, userComments, myUserComments }) => {
    const [CommentText, setCommentText] = useState('')
    const { width } = useWindowDimensions();
    const [first, setfirst] = useState(true)
    const [Visible, setVisible] = useState(false)

    const isLoved = false


    useEffect(() => {
        setfirst(!first)
    }, [userLike])

    // For Favorite feature
    // ----------------
    const iconPresHandler = () => {
        if (userIdentification) {
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
                duration: 2000,
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
                duration: 2000,
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
                duration: 2000,
                message: 'Error while commenting',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const updateCommentToFirestore = async (comment) => {
        let cmtid = generateCommentId(CommentText.substring(0, 5))

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
                        duration: 2000,
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
                duration: 2000,
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
                        duration: 2000,
                        message: 'Blog post share successfully',
                        type: 'info',
                    })
                )
            })
            .catch((err) => {
                return (
                    showMessage({
                        duration: 2000,
                        message: 'Error during sharing the blog post',
                        description: 'Try again after reopening app',
                        type: 'warning',
                    })
                )
            });
    }


    return (
        <>
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
            <View style={STYLES.cardCont} >
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Card.Cover source={{ uri: allBlogs[params]?.ImageUrl }} resizeMode='contain' />
                </TouchableOpacity>
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
                                < MaterialIcons name='favorite-border' size={24} color={ThemeColors.CGREEN} onPress={() => showMessage({ type: 'info', message: 'Add to favorite feature coming soon', duration: 3000 })} />
                            }
                            {/* <MaterialIcons name='favorite-border' size={24} color={ThemeColors.CGREEN} onPress={() => iconPresHandler()} /> */}
                        </TouchableOpacity>
                    </View>
                </Card.Content>
                <Surface style={STYLES.engagementCont(width)} elevation={1} >
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
                </Surface>
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
        userLike: state.UserAuth.userLike,
        userComments: state.UserAuth.userComments,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)


const STYLES = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalCont: {
        flex: 1,
    },
    modalSubCont: {
        // paddingVertical: vs(10),
        flex: 1,
        // justifyContent: "center",
        // alignItems: 'center',
        backgroundColor: ThemeColors.WHITE
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
        marginVertical: vs(5)
    },
    cmntText: {
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
        borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: ms(10),
    },
    input: (width) => ({
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
    engagementCont: (width) => ({
        borderRadius: ms(10),
        flexDirection: 'row',
        paddingVertical: ms(5),
        paddingHorizontal: ms(10),
        borderWidth: 1,
        alignContent: 'center',
        justifyContent: 'space-between',
    }),
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(10),
    },
})