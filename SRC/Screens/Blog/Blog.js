import { connect } from 'react-redux'
import { Card, Text } from 'react-native-paper'
import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'
import React, { useState, useEffect } from 'react'
import { ms, mvs, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import firestore from '@react-native-firebase/firestore'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, Modal, TouchableOpacity, View, FlatList, useWindowDimensions, Image } from 'react-native'

const Blog = ({ route, allBlogs, userComments, blogViewsCount, myBlogViewsCount, userIdentification, usersData }) => {
    const { params } = route
    const { width } = useWindowDimensions();
    const [first, setfirst] = useState(true)
    const [Show, setShow] = useState(true)
    const [Visible, setVisible] = useState(false)


    useEffect(() => {
        setfirst(!first)
    }, [userComments])

    useEffect(() => {
        // cal the counter function
        blogViewsCountHandler()
    }, [])


    // For Comment feature
    // ----------------

    function extractAllCommentsWithUser(commentsObject) {
        const commentsWithUser = [];

        for (const user in commentsObject) {
            const userComments = commentsObject[user];
            for (const cmtId in userComments) {
                const commentData = {
                    user: user,
                    comment: userComments[cmtId]?.cmt
                };
                commentsWithUser.push(commentData);
            }
        }

        return commentsWithUser;
    }


    // For blogViewsCount state
    const blogViewsCountHandler = () => {
        if (userIdentification) {
            getblogViewsCountFromFirestore(allBlogs[params]?.BlogId)
        } else if (!userIdentification) {
            // getblogViewsCountFromFirestore(BlogId)
            console.log('user is not loggedIn - blogViewsCountHandler - Blog.js')
        } else {
            // case when error occur while updating blog view count
            console.log('else case - blogViewsCountHandler - Blog.js')
        }
    }

    const getblogViewsCountFromFirestore = async (BlogId) => {
        try {
            let dataRef = firestore().collection('BlogViewsCount');
            let snapshot = await dataRef?.get()
            let newBlogViewsCount = true
            snapshot.forEach(doc => {
                if (doc.id == BlogId) {
                    newBlogViewsCount = false
                }
            });
            newBlogViewsCount ? uploadblogViewsCountToFirestore() : updateblogViewsCountToFirestore()
        } catch (error) {
            // error while fetching data from fb fs.
            console.log(error, 'error on getblogViewsCountFromFirestore')
        }
    }
    const uploadblogViewsCountToFirestore = async () => {
        try {
            firestore()
                .collection('BlogViewsCount')
                .doc(allBlogs[params]?.BlogId)
                .set({ //adding userid with its comments also generating commentid
                    [userIdentification]: {
                        ViewsCount: 1
                    }
                })
                .then(() => {
                    myBlogViewsCount({
                        ...blogViewsCount,
                        [allBlogs[params]?.BlogId]: {
                            [userIdentification]: {
                                ViewsCount: 1
                            }
                        }
                    })
                });
        } catch (error) {
            // error while uploading blogveiw count
            console.log(error, 'error on uploadblogViewsCountToFirestore')
        }
    }

    const updateblogViewsCountToFirestore = async () => {
        try {
            firestore()
                .collection('BlogViewsCount')
                .doc(allBlogs[params]?.BlogId)
                .update({
                    ...blogViewsCount[allBlogs[params]?.BlogId],
                    [userIdentification]: {
                        ...blogViewsCount[allBlogs[params]?.BlogId]?.[userIdentification],
                        ViewsCount: (blogViewsCount[allBlogs[params]?.BlogId]?.[userIdentification]?.ViewsCount || 0) + 1,
                    }
                })
                .then(() => {
                    myBlogViewsCount({
                        ...blogViewsCount,
                        [allBlogs[params]?.BlogId]: {
                            ...blogViewsCount[allBlogs[params]?.BlogId],
                            [userIdentification]: {
                                ...blogViewsCount[allBlogs[params]?.BlogId]?.[userIdentification],
                                ViewsCount: (blogViewsCount[allBlogs[params]?.BlogId]?.[userIdentification]?.ViewsCount || 0) + 1,
                            }
                        },
                    })
                });
        } catch (error) {
            console.log(error, 'error on updateblogViewsCountToFirestore')
        }
    }

    return (
        <>
            <View style={STYLES.mainCont}>
                {/* all Comments modal  */}
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
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])}
                                renderItem={({ item }) => {
                                    return (
                                        <Card style={STYLES.modalCommentCard} >
                                            <View style={STYLES.cmnt} >
                                                <View style={STYLES.cmntImgCont} >
                                                    {usersData[item?.user]?.photoURL ?
                                                        <Image source={{ uri: usersData[item?.user]?.photoURL }} style={STYLES.authorImg} />
                                                        :
                                                        <FontAwesome name={'user-circle'} size={40} />
                                                    }
                                                </View>
                                                <TouchableOpacity activeOpacity={0.5} style={STYLES.cmntTextCont(width)} >
                                                    {
                                                        usersData[item?.user]?.displayName ? (
                                                            <Text variant='labelSmall'>{usersData[item?.user]?.displayName}</Text>
                                                        ) : (
                                                            <Text variant='labelSmall'>This user hasn't set his/her display name</Text>
                                                        )
                                                    }
                                                    <Text style={STYLES.cmntText} variant='bodyLarge' >{item?.comment}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Card>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])?.slice(0, 3)}
                    ListHeaderComponent={() => <HeaderComponent commentsForLength={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])} params={params} Show={Show} setShow={setShow} />}
                    ListFooterComponent={() => <FooterComponent commentsForLength={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])} setVisible={setVisible} />}
                    renderItem={({ item }) => {
                        console.log(item)
                        if (Show) {
                            return (
                                <Card style={STYLES.commentSectionCont}>
                                    <View style={STYLES.cmnt} >
                                        <View style={STYLES.cmntImgCont} >
                                            {usersData[item?.user]?.photoURL ?
                                                <Image source={{ uri: usersData[item?.user]?.photoURL }} style={STYLES.authorImg} />
                                                :
                                                <FontAwesome name={'user-circle'} size={40} />
                                            }
                                        </View>
                                        <TouchableOpacity activeOpacity={0.5} style={STYLES.cmntTextCont(width)} >
                                            {
                                                usersData[item?.user]?.displayName ? (
                                                    <Text variant='labelSmall'>{usersData[item?.user]?.displayName}</Text>
                                                ) : (
                                                    <Text variant='labelSmall'>This user hasn't set his/her display name</Text>
                                                )
                                            }
                                            <Text style={STYLES.cmntText} variant='bodyLarge' >{item?.comment}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            )
                        }
                    }}
                />
            </View>
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
    myBlogViewsCount: Creators.blogViewsCount,
    myUser: Creators.user,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userLike: state.UserAuth.userLike,
        userComments: state.UserAuth.userComments,
        blogViewsCount: state.UserAuth.blogViewsCount,
        usersData: state.UserAuth.usersData,
        userFromStore: state.UserAuth.user,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Blog)

const STYLES = StyleSheet.create({
    authorImg: {
        width: 40,
        height: 40,
        borderRadius: ms(25),
    },
    modalCommentCard: {
        marginVertical: mvs(3),
        backgroundColor: ThemeColors.WHITE
    },
    iconCont: {
        position: 'absolute',
        zIndex: 1,
        top: 15,
        right: 5,
        borderRadius: ms(50),
        backgroundColor: ThemeColors.CGREEN,
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
        paddingVertical: vs(10),
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: ThemeColors.LIGHTGRAY
    },
    cmntTextCont: (width) => ({
        marginLeft: ms(8),
        width: (width) - (width / 3),
        borderRadius: ms(8),
        padding: ms(5),
    }),
    cmnt: {
        marginVertical: vs(5),
        borderRadius: ms(8),
        paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        flexDirection: 'row',
        // borderWidth: 1,
    },
    commentSectionCont: {
        marginVertical: vs(2),
        borderRadius: ms(2),
        backgroundColor: ThemeColors.WHITE,
    },
    mainCont: {
        flex: 1,
        paddingHorizontal: ms(10),
        paddingVertical: vs(5),
        backgroundColor: ThemeColors.LIGHTGRAY,
    },
})
