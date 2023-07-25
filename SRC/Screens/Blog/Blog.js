import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { Card, Text } from 'react-native-paper'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HeaderComponent from './HeaderComponent'
import { StyleSheet, TouchableOpacity, View, FlatList, useWindowDimensions } from 'react-native'

const Blog = ({ route, allBlogs, userComments, myUserComments }) => {
    const { params } = route
    const { width } = useWindowDimensions();
    const [first, setfirst] = useState(true)


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
                <Card style={STYLES.commentSectionCont}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={extractAllCommentsWithUser(userComments[allBlogs[params]?.BlogId])}
                        ListHeaderComponent={() => <HeaderComponent params={params} />}
                        renderItem={({ item }) => {
                            return (
                                <View style={STYLES.cmnt} >
                                    <View style={STYLES.cmntImgCont} >
                                        <FontAwesome name={'user-circle'} size={40} />
                                    </View>
                                    <TouchableOpacity onPress={() => console.log('Comment Press')} style={STYLES.cmntTextCont(width)} >
                                        <Text variant='labelSmall' >{item?.user}</Text>
                                        <Text style={STYLES.cmntText} variant='bodyLarge' >{item?.comment}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
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
    cmntText: {
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