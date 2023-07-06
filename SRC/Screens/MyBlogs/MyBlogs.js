import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { ms, vs } from 'react-native-size-matters'
import { Card, Text, Button } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { Creators } from '../../Redux/Action/Action'
import { connect } from 'react-redux'


const MyBlogs = ({ isUserLoggedIn, userIdentification, userBlogs }) => {
    const navigation = useNavigation()

    let BlogData = Object.keys(userBlogs)

    const BlogData____ = [
        // {
        //     title: 'Done is better than perfect Done is better than perfect Done is better than perfect',
        //     author: "Someone",
        //     date: new Date(),
        //     id: 1,
        //     blog: 'Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , Done is better than perfect ,Done is better than perfect ,Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , ',
        //     img_url: require('../../Assets/Images/demo.jpg')

        // },
        // {
        //     title: 'Venture Dive',
        //     author: "Someone--",
        //     date: new Date(),
        //     id: 2,
        //     blog: 'Blog Venture Dive, Venture Dive , Venture Dive , Venture Dive , ,  Venture Dive , Venture Dive , ',
        //     img_url: require('../../Assets/Images/fetch.png')

        // },
        // {
        //     title: 'If you know, you know',
        //     author: "Someone++",
        //     date: new Date(),
        //     id: 3,
        //     blog: 'Blog If you know, you know, If you know, you know , If you know, you know , If you know, you know , , If you know, you know ,If you know, you know , ',
        //     img_url: require('../../Assets/Images/talk.jpg')
        // },
    ]

    


    // const check = () => {
    //     console.log("userIdentification - blog screen: ", userIdentification)
    //     console.log("isUserLoggedIn - blog screen: ", isUserLoggedIn)
    // }

    const check = () => {

        console.log("MyBlogs Screen - userBlogs: ", userBlogs)

    }
    if (isUserLoggedIn && BlogData.length > 0) {
        return (
            <View style={STYLES.mainCont}>
                <View style={STYLES.headingCont}>
                    <Text style={STYLES.heading}>My Blogs</Text>
                </View>
                <TouchableOpacity style={STYLES.btnCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG)}>
                    <AntDesign name='pluscircle' size={50} />
                </TouchableOpacity>
                <View style={STYLES.myBlogsCont}>
                    <FlatList
                        data={BlogData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            console.log(userBlogs[item]?.ImageUrl)
                            return (
                                <Card style={STYLES.cardCont} >
                                    <Card.Cover source={{ uri: userBlogs[item]?.ImageUrl }} />
                                    <TouchableOpacity activeOpacity={0.7} >
                                        <Card.Content>
                                            <Text variant="titleLarge">{userBlogs[item]?.Title}</Text>
                                            <Text variant="bodyMedium">{userBlogs[item]?.Content}</Text>
                                            <View style={STYLES.infoCont}>
                                                <View>
                                                    <Text variant="titleSmall">Author: {userBlogs[item]?.Author}</Text>
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </TouchableOpacity>
                                </Card>
                            )
                        }}
                    />
                </View>
            </View>
        )
    } else if (isUserLoggedIn && BlogData.length <= 0) {
        return (
            <View style={STYLES.mainContNL}>
                <TouchableOpacity style={STYLES.btnCont} onPress={() => navigation.navigate(NavigationStrings.ADDBLOG)}>
                    {/* <TouchableOpacity style={STYLES.btnCont} onPress={() => check()}> */}
                    <AntDesign name='pluscircle' size={50} />
                </TouchableOpacity>
                <Text style={STYLES.heading} onPress={() => check()} >You didn't write any blogs.</Text>

            </View>
        )
    }
    else {
        return (
            <View style={STYLES.mainContNL}>
                <Text style={STYLES.heading} >You're not logged in.</Text>
                <Text style={STYLES.heading} >Do login/signup from profile</Text>
            </View>
        )
    }

}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myuserBlogs: Creators.userBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
        userBlogs: state.UserAuth.userBlogs,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBlogs)



const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    mainContNL: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        justifyContent: 'center',
    },
    subContNL: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    headingCont: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center'
    },
    myBlogsCont: {
        flex: 1
    },
    cardCont: {
        marginVertical: vs(5)
    },
    infoCont: {
        flexDirection: 'row'
    },
    btnCont: {
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 20,

    },
    btn: {
        marginVertical: vs(3)
    }
})