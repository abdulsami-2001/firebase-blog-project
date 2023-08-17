import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../Redux/Action/Action'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import { Card, Surface, Text } from 'react-native-paper'
import { ThemeColors } from '../Utils/ThemeColors/ThemeColors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StyleSheet, VirtualizedList, TouchableOpacity, View, ScrollView, TextInput, useWindowDimensions, FlatList } from 'react-native'

const CommentSection = ({ userIdentification, params, allBlogs, userComments, myUserComments }) => {
    const { width } = useWindowDimensions()
    const [CommentText, setCommentText] = useState('')


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

    // For Comment feature
    // ----------------
    const commentPressHandler = () => {
        if (userIdentification) {
            // getCommentsFromFirestore(BlogId)

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

    return (
        <>
            <Surface style={STYLES.inputCont} >
                <TextInput
                    style={STYLES.input(width)}
                    placeholder='Write a comment'
                    value={CommentText}
                    onChangeText={(text) => setCommentText(text)}
                />
                <TouchableOpacity onPress={() => commentPressHandler()} >
                    <MaterialIcons name='send' size={35} color={ThemeColors.CGREEN} />
                </TouchableOpacity>
            </Surface>
            <Card style={STYLES.commentSectionCont}>
                <FlatList
                    data={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])}
                    // data={extractAllCommentsWithUser(userComments[params])}
                    renderItem={({ item }) => {
                        return (
                            <View style={STYLES.cmnt} >
                                <View style={STYLES.cmntImgCont} >
                                    <FontAwesome name={'user-circle'} size={40} />
                                </View>
                                <TouchableOpacity style={STYLES.cmntTextCont(width)} >
                                    <Text>{item?.user}</Text>
                                    <Text style={STYLES.cmntText} >{item?.comment}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentSection)

const STYLES = StyleSheet.create({
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
        marginTop: vs(5),
        padding: ms(5),
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: ms(10),
    },
    input: (width) => ({
        width: width - ms(80),
        borderWidth: 1,
        borderRadius: ms(10),
    }),
})