import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'

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

    return (
        <View style={STYLES.mainCont}>
            <View style={STYLES.subCont}>
                <FlatList
                    data={BlogData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={STYLES.cardCont} activeOpacity={0.7} >
                                <Card >
                                    <Card.Cover source={item.img_url} />
                                    <Card.Content>
                                        <Text variant="titleLarge">{item.title}</Text>
                                        <Text variant="bodyMedium">{item.blog}</Text>
                                        <Text variant="bodyMedium">Author: {item.author}</Text>
                                        <Text variant="bodyMedium">Date: {item.date.toString()}</Text>
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

export default Home


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5,
        backgroundColor: 'purple'
    },
    subCont: {
    },
    cardCont: {
        marginVertical: 5
    }
})