import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Text } from 'react-native-paper'
import { ms, vs } from 'react-native-size-matters'
import { connect } from 'react-redux'
import { Creators } from '../../Redux/Action/Action'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'

const Blog = ({ route, myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs, myallBlogs, allBlogs, myuserFavorites, userFavorites }) => {
    const [first, setfirst] = useState(true)
    const { params } = route

    // useEffect(() => {
    //     setfirst(!first)
    // }, [userFavorites, userIdentification, isUserLoggedIn])



    const isLoved = false
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
            // const data = firestore()?.collection().where().get()

            let dataRef = firestore().collection('Favorites');
            let snapshot = await dataRef?.get()
            let newUser = true
            snapshot.forEach(doc => {
                if (doc.id == userIdentification) {
                    newUser = false
                }
            });

            console.log(newUser)

            newUser ? uploadFavoritesToFirestore() : updateFavoritesToFirestore()

            // console.log("BlogData ", ...BlogData)
            // myallBlogs({ ...datatemp, ...BlogData })
            // myallBlogs({ ...datatemp })

        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
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



    console.log(params)
    return (
        <View style={STYLES.mainCont}>
            <Card style={STYLES.cardCont} >
                <Card.Cover source={{ uri: allBlogs[params]?.ImageUrl }} />
                <Card.Content>
                    <Text variant="titleLarge">{allBlogs[params]?.Title}</Text>
                    <Text variant="bodyMedium">{allBlogs[params]?.Content}</Text>
                    <View style={STYLES.infoCont}>
                        <View>
                            <Text variant="titleSmall">Author: {allBlogs[params]?.Author}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={STYLES.btnCont}  >
                            {isLoved ?
                                <MaterialIcons name='favorite' size={24} />
                                :
                                <MaterialIcons name='favorite-border' size={24} onPress={() => iconPresHandler()} />
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

