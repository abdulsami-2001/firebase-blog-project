import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { ms, vs } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux'
import { Creators } from '../../Redux/Action/Action'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'

const Home = ({ myUserState, isUserLoggedIn, myUserId, userIdentification, myuserBlogs, userBlogs, myallBlogs, allBlogs }) => {
    const navigation = useNavigation()
    let BlogData = Object.keys(allBlogs)
    const { width } = Dimensions.get('screen')

    useEffect(() => {
        getDataFromFirestore()
    }, [userBlogs])

    const getDataFromFirestore = async () => {
        try {
            // const data = firestore()?.collection().where().get()
            let datatemp = {}
            let dataRef = firestore().collection('Users');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                datatemp = { ...tempdoc, ...datatemp }
            });

            // console.log("BlogData ", ...BlogData)
            // myallBlogs({ ...datatemp, ...BlogData })
            myallBlogs({ ...datatemp })

        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
            })
        }
    }

    return (
        <View style={STYLES.mainCont}>
            <View style={STYLES.subCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                <Card  >
                                    <Card.Cover source={{ uri: allBlogs[item]?.ImageUrl }} />
                                    <Card.Content>
                                        <Text variant="titleLarge">{allBlogs[item]?.Title}</Text>
                                        <Text variant="bodyMedium">{allBlogs[item]?.Content}</Text>
                                        <View style={STYLES.infoCont}>
                                            <View>
                                                <Text variant="titleSmall">Author: {allBlogs[item]?.Author}</Text>
                                            </View>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View >
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


export default connect(mapStateToProps, mapDispatchToProps)(Home)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // flexDirection: 'row',
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        // backgroundColor: 'purple'
    },
    subCont: {
    },
    cardCont: (width) => ({
        marginVertical: vs(5),
        // backgroundColor:'red'
        width: width
    }),
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

