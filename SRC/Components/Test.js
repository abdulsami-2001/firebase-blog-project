import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { Types, Creators } from '../Redux/Action/Action'
import { connect } from 'react-redux'

const Test = ({ isUserLoggedIn, myUserState }) => {
    console.log("isUserLoggedIn ", isUserLoggedIn)
    console.log("Creators ", Creators)
    console.log("Types ", Types)

    return (
        <View>
            <Text>Test</Text>
            <Button title='change' onPress={() => myUserState(!isUserLoggedIn)} />
        </View>
    )
}


const mapDispatchToProps = {
    myUserState: Creators.userState,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test)

const styles = StyleSheet.create({})