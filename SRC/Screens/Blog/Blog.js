import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Text } from 'react-native-paper'
import { ms, vs } from 'react-native-size-matters'

const Blog = (item) => {
    const isLoved = false

    const { params } = item?.route
    return (
        <View style={STYLES.mainCont}>
            <Card style={STYLES.cardCont} >
                <Card.Cover source={params.img_url} />
                <Card.Content>
                    <Text variant="titleLarge">{params.title}</Text>
                    <Text variant="bodyMedium">{params.blog}</Text>
                    <View style={STYLES.infoCont}>
                        <View>
                            <Text variant="titleSmall">Author: {params.author}</Text>
                            <Text variant="titleSmall">Date: {params.date.toString()}</Text>
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

export default Blog

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

