import { connect } from 'react-redux'
import { Card, Text } from 'react-native-paper'
import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, Modal, TouchableOpacity, View, FlatList, useWindowDimensions } from 'react-native'

const Blog = ({ route, allBlogs, userComments, myUserComments }) => {
    const { params } = route
    const { width } = useWindowDimensions();
    const [first, setfirst] = useState(true)
    const [Show, setShow] = useState(true)
    const [Visible, setVisible] = useState(false)


    useEffect(() => {
        setfirst(!first)
    }, [userComments])


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

    return (
        <>
            <View style={STYLES.mainCont}>
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
                                        <View style={STYLES.cmnt} >
                                            <View style={STYLES.cmntImgCont} >
                                                <FontAwesome name={'user-circle'} size={40} />
                                            </View>
                                            <TouchableOpacity activeOpacity={0.5} style={STYLES.cmntTextCont(width)} >
                                                <Text variant='labelSmall' >{item?.user}</Text>
                                                <Text style={STYLES.cmntText} variant='bodyLarge' >{item?.comment}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <Card style={STYLES.commentSectionCont}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])?.slice(0, 3)}
                        ListHeaderComponent={() => <HeaderComponent commentsForLength={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])} params={params} Show={Show} setShow={setShow} />}
                        ListFooterComponent={() => <FooterComponent commentsForLength={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])} setVisible={setVisible} />}
                        renderItem={({ item }) => {
                            if (Show) {
                                return (
                                    <View style={STYLES.cmnt} >
                                        <View style={STYLES.cmntImgCont} >
                                            <FontAwesome name={'user-circle'} size={40} />
                                        </View>
                                        <TouchableOpacity activeOpacity={0.5} style={STYLES.cmntTextCont(width)} >
                                            <Text variant='labelSmall' >{item?.user}</Text>
                                            <Text style={STYLES.cmntText} variant='bodyLarge' >{item?.comment}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        }}
                    />
                </Card>
            </View>
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


export default connect(mapStateToProps, mapDispatchToProps)(Blog)

const STYLES = StyleSheet.create({
    iconCont: {
        position: 'absolute',
        zIndex: 1,
        top: 15,
        right: 5,
        backgroundColor: ThemeColors.CGREEN,
        borderRadius: 50,
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
        backgroundColor: ThemeColors.WHITE
    },
    cmntTextCont: (width) => ({
        marginLeft: ms(8),
        width: (width) - (width / 3),
        borderRadius: 10,
        padding: ms(5),
    }),
    cmnt: {
        marginVertical: vs(5),
        borderRadius: ms(10),
        paddingVertical: vs(10),
        paddingHorizontal: ms(10),
        flexDirection: 'row',
        borderWidth: 1,
    },
    commentSectionCont: {
        marginVertical: vs(5),
        padding: ms(10),
    },
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
})





// like = [
//     {
//         id:'',
//         userId:''
//         postid
//     }
// ]