import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Text } from 'react-native-paper'
import { ms, vs } from 'react-native-size-matters'
import { connect } from 'react-redux'
import { Creators } from '../../Redux/Action/Action'

const Blog = ({ route, myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs, myallBlogs, allBlogs }) => {
    const isLoved = false

    const { params } = route
    console.log(allBlogs)
    return (
        <View style={STYLES.mainCont}>
            <Card style={STYLES.cardCont} >
                <Card.Cover source={{uri:allBlogs[params]?.ImageUrl}} />
                <Card.Content>
                    <Text variant="titleLarge">{allBlogs[params]?.Ttile}</Text>
                    <Text variant="bodyMedium">{allBlogs[params]?.Content}</Text>
                    <View style={STYLES.infoCont}>
                        <View>
                            <Text variant="titleSmall">Author: {allBlogs[params]?.Author}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={STYLES.btnCont}  >
                            {isLoved ?
                                <MaterialIcons name='favorite' size={24} />
                                :
                                <MaterialIcons name='favorite-border' size={24} />
                            }
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}




const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myallBlogs: Creators.allBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Blog)


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexDirection: 'row',
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        // backgroundColor: 'purple'
    },
    subCont: {
    },
    cardCont: {
        marginVertical: vs(5)
    },
    infoCont: {
        flexDirection: 'row'
    },
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:"purple",
        paddingHorizontal: ms(10),
    }
})

