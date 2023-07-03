import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { Types, Creators } from '../Redux/Action/Action'
import { connect } from 'react-redux'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';


const Test = ({ isUserLoggedIn, myUserState }) => {
    const [Img, setImg] = useState(null)
    // console.log("isUserLoggedIn ", isUserLoggedIn)
    // console.log("Creators ", Creators)
    // console.log("Types ", Types)

    // const referenceHandler = async () => {
    //     const reference = storage().ref('black-t-shirt-sm.png');
    //     console.log(reference)
    // }

    console.log(Img)

    const cloudFirestoreHandler = async () => {
        const { _data } = await firestore().collection('Blogs')?.doc('test')?.get();
        console.log(_data?.img?._documentPath?._parts[0])
        setImg(_data?.img?._documentPath?._parts[0])
    }

    return (
        <View>
            <Text>Test</Text>
            <Button title='change' onPress={() => myUserState(!isUserLoggedIn)} />
            {/* <Button title='create Reference' onPress={() => referenceHandler()} /> */}
            <Button title='fetch from firestore' onPress={() => cloudFirestoreHandler()} />
            <Image source={{ uri: Img }} width={100} height={100} />
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