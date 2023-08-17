import { connect } from 'react-redux'
import Lottie from 'lottie-react-native';
import { ms, vs } from 'react-native-size-matters'
import { Card, Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'

const Favorite = ({ isUserLoggedIn, userIdentification, }) => {
    const { width, height } = Dimensions.get('screen')
    const navigation = useNavigation()
    const [first, setfirst] = useState(true)

    useEffect(() => {
        setfirst(!first)
    }, [userIdentification, isUserLoggedIn])

    // favorites population krni ha

    let BlogData = Object.keys({})


    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)}>
                                <Card>
                                    <Card.Cover source={{ uri: userFavorites[item]?.ImageUrl }} resizeMode='contain' />
                                    <Card.Content>
                                        <Text variant="titleLarge" style={STYLES.textHeading} >{userFavorites[item]?.Title}</Text>
                                        <Text variant="bodyMedium" style={STYLES.text}>Tap to read</Text>
                                        <View style={STYLES.authorCont} >
                                            <Text variant="titleSmall" style={STYLES.textHeading}>Author: </Text>
                                            <Text style={STYLES.text}>{userFavorites[item]?.Author}</Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </TouchableOpacity>
                        )
                    }
                    }
                />
            </View>
        )
    } else if (isUserLoggedIn && BlogData.length <= 0) {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading}>You don't have favorite blogs.</Text>
                </View>
            </View>
        )
    }
    else {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading} >You're not logged in.</Text>
                    <Text style={STYLES.heading} >Login/signup is required.</Text>
                </View>
            </View>
        )
    }
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
    lottieCont: (width, height) => ({
        width: width,
        height: height / 4,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    authorCont: {
        flexDirection: 'row',
    },
    cardCont: (width) => ({
        marginVertical: 5,
        width: width - ms(30)
    }),
    headingCont: {
        marginVertical: vs(20),
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center',
        color: ThemeColors.GRAY,
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