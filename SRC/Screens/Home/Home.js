import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { Card, Text } from 'react-native-paper'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'

const Home = ({ userBlogs, myallBlogs, allBlogs, userLike, myUserLike }) => {
    const navigation = useNavigation()
    let BlogData = Object.keys(allBlogs)
    const { width } = Dimensions.get('screen')

    useEffect(() => {
        getDataFromFirestore()
    }, [userBlogs])
    useEffect(() => {
        getLikeFromFirestore()
    }, [])

    const getLikeFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('Like');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                let anotherTemp = doc.id
                datatemp = { [anotherTemp]: tempdoc, ...datatemp }
            });

            // console.log(datatemp)
            myUserLike({ ...datatemp })


        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching Blog Likes',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    const getDataFromFirestore = async () => {
        try {
            let datatemp = {}
            let dataRef = firestore().collection('Users');
            let snapshot = await dataRef?.get()
            snapshot.forEach(doc => {
                let tempdoc = doc?.data()
                datatemp = { ...tempdoc, ...datatemp }
            });

            myallBlogs({ ...datatemp })

        } catch (error) {
            console.log(error)
            showMessage({
                duration: 2000,
                message: 'Error while fetching blogs',
                description: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }


    return (
        <View style={STYLES.mainCont}>
            <View style={STYLES.subCont}>
                <FlatList
                    data={BlogData}
                    key={Math.random()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                <Card>
                                    <Card.Cover source={{ uri: allBlogs[item]?.ImageUrl }} resizeMode='contain' />
                                    <Card.Content>
                                        <Text variant="titleLarge" style={STYLES.textHeading}>{allBlogs[item]?.Title}</Text>
                                        <Text variant="bodyMedium" style={STYLES.text}>Tap to read</Text>
                                        <View style={STYLES.infoCont}>
                                            <View style={STYLES.authorCont} >
                                                <Text variant="titleSmall" style={STYLES.textHeading}>Author: </Text>
                                                <Text style={STYLES.text}>{allBlogs[item]?.Author}</Text>
                                            </View>
                                        </View>
                                        {/* <View style={STYLES.engagementCont} >
                                            <TouchableOpacity onPress={{}} style={STYLES.likeCont} >
                                                <Text variant="titleSmall" style={STYLES.textHeading}>L</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={{}} style={STYLES.commentCont} >
                                                <Text variant="titleSmall" style={STYLES.textHeading}>C</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={{}} style={STYLES.shareCont} >
                                                <Text variant="titleSmall" style={STYLES.textHeading}>S</Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myallBlogs: Creators.allBlogs,
    myUserLike: Creators.userLike,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userLike: state.UserAuth.userLike,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const STYLES = StyleSheet.create({
    engagementCont: {
        flexDirection: 'row',
        // backgroundColor: 'pink',
        marginTop: vs(10),
        justifyContent: 'space-around',
    },
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    subCont: {
    },
    cardCont: (width) => ({
        marginVertical: vs(5),
        width: width - ms(30)
    }),
    infoCont: {
        flexDirection: 'row'
    },
    authorCont: {
        flexDirection: 'row',
    },
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: ms(10),
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        color: ThemeColors.GRAY,
        fontSize: 15,
    },
})

