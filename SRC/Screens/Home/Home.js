import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { Card, Text } from 'react-native-paper'
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'

const Home = ({ userBlogs, myallBlogs, allBlogs }) => {
    const navigation = useNavigation()
    let BlogData = Object.keys(allBlogs)
    const { width } = Dimensions.get('screen')

    useEffect(() => {
        getDataFromFirestore()
    }, [userBlogs])

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

