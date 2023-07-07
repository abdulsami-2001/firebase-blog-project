import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { Creators } from '../../Redux/Action/Action'


const Favorite = ({ myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs, myuserFavorites, userFavorites }) => {
    const { width } = Dimensions.get('screen')
    const [first, setfirst] = useState(true)

    useEffect(() => {
        setfirst(!first)
    }, [userFavorites, userIdentification, isUserLoggedIn])


    let BlogData = Object.keys(userFavorites)


    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Card style={STYLES.cardCont(width)} >
                                <Card.Cover source={{ uri: userFavorites[item]?.ImageUrl }} />
                                <TouchableOpacity activeOpacity={0.7} >
                                    <Card.Content>
                                        <Text variant="titleLarge">{userFavorites[item]?.Title}</Text>
                                        <Text variant="bodyMedium">{userFavorites[item]?.Content}</Text>
                                    </Card.Content>
                                </TouchableOpacity>
                            </Card>
                        )
                    }}
                />
            </View>
        )
    } else if (isUserLoggedIn && BlogData.length <= 0) {
        return (
            <View style={STYLES.mainCont}>
                <Text style={STYLES.heading}>You don't have favorite blogs.</Text>
            </View>
        )
    }
    else {
        return (
            <View style={STYLES.mainCont}>
                <Text style={STYLES.heading} >You're not logged in.</Text>
                <Text style={STYLES.heading} >Do login/signup from profile</Text>
            </View>
        )
    }


}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myuserFavorites: Creators.userFavorites,
    myallBlogs: Creators.allBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFavorites: state.UserAuth.userFavorites,
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Favorite)


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5,
        // backgroundColor: 'purple'
    },
    subCont: {
    },
    cardCont: (width) => ({
        marginVertical: 5,
        width: width

    }),
    heading: {
        fontSize: 22,
        alignSelf: 'center'
    },
})