import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ms, vs } from 'react-native-size-matters'

const Profile = () => {
    return (
        <View style={STYLES.mainCont}>
            <Text>Profile</Text>
        </View>
    )
}

export default Profile

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },

})