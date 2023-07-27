import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const FooterComponent = ({ commentsForLength, setVisible }) => {
    if (commentsForLength.length > 3) {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => setVisible(true)}>
                <Text style={STYLES.text} >Click to see all comments</Text>
            </TouchableOpacity>
        )
    } else {
        return null
    }


}
export default FooterComponent

const STYLES = StyleSheet.create({
    text: {
        alignSelf: 'center'
    }
})