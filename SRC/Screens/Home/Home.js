import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { ms, vs } from 'react-native-size-matters'
import auth from '@react-native-firebase/auth';

const BlogData = [
    {
        title: 'Done is better than perfect Done is better than perfect Done is better than perfect',
        author: "Someone",
        date: new Date(),
        id: 1,
        blog: 'Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , Done is better than perfect ,Done is better than perfect ,Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , ',
        img_url: require('../../Assets/Images/demo.jpg')

    },
    {
        title: 'Venture Dive',
        author: "Someone--",
        date: new Date(),
        id: 2,
        blog: 'Blog Venture Dive, Venture Dive , Venture Dive , Venture Dive , ,  Venture Dive , Venture Dive , ',
        img_url: require('../../Assets/Images/fetch.png')

    },
    {
        title: 'If you know, you know',
        author: "Someone++",
        date: new Date(),
        id: 3,
        blog: 'Blog If you know, you know, If you know, you know , If you know, you know , If you know, you know , , If you know, you know ,If you know, you know , ',
        img_url: require('../../Assets/Images/talk.jpg')
    },
]


const Home = () => {
    const navigation = useNavigation()

    return (
        <View style={STYLES.mainCont}>
            <View style={STYLES.subCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Card style={STYLES.cardCont} >
                                <Card.Cover source={item.img_url} />
                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)} >
                                    <Card.Content>
                                        <Text variant="titleLarge">{item.title}</Text>
                                        <Text variant="bodyMedium">{item.blog}</Text>
                                        <View style={STYLES.infoCont}>
                                            <View>
                                                <Text variant="titleSmall">Author: {item.author}</Text>
                                                <Text variant="titleSmall">Date: {item.date.toString()}</Text>
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
}

export default Home


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

