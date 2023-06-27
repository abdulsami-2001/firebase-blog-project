import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'
import React, { useState } from 'react'
import { ms, vs } from 'react-native-size-matters'
import { TextInput } from 'react-native-paper';

const AddBlog = () => {
    const [text, setText] = useState("");
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    return (

        <View style={STYLES.mainCont}>
            <ScrollView>
                <View style={STYLES.headingCont}>
                    <Text style={STYLES.heading}>Write a blog</Text>
                </View>
                <View style={STYLES.inputCont}>
                    <TextInput
                        label="Title"
                        value={text}
                        type='outlined'
                        onChangeText={text => setText(text)}
                        style={STYLES.input}
                    />
                    <TextInput
                        label="Blog Content"
                        value={text1}
                        type='outlined'
                        multiline
                        onChangeText={text => setText1(text)}
                        style={STYLES.input}
                    />
                    <TextInput
                        label="Author"
                        value={text}
                        type='outlined'
                        onChangeText={text => setText2(text)}
                        style={STYLES.input}
                    />
                </View>
                <View style={STYLES.btnCont}>
                    <Button title='Add Image' />
                </View>
            </ScrollView>
        </View>

    )
}

export default AddBlog


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    headingCont: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 22
    },
    input: {
        marginVertical: vs(8),
    },
    btnCont:{
        
    }
})