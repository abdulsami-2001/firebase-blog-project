import { Text, View } from 'react-native';
import React, { useState, useEffect } from 'react'
import NetInfo from "@react-native-community/netinfo";
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message';
import { ThemeColors } from '../ThemeColors/ThemeColors';


export const generateKey = (title) => {
    let stringWithSpace = `${new Date().getTime()}___${(title).substring(0, 10)}`
    return stringWithSpace.replace(/ /g, '_');
}


const getDocumentsFromFirebase = async () => {
    try {
        let datatemp = {}
        let dataRef = firestore().collection('Users');
        let snapshot = await dataRef?.get()
        snapshot.forEach(doc => {
            let tempdoc = doc?.data()
            datatemp = { ...tempdoc, ...datatemp }
        });


    } catch (error) {
        showMessage({
            duration: 3000,
            message: 'Error while fetching blogs',
            description: "Make sure you have working internet",
            type: 'warning',
        })
    }
}

export const Internet = () => {
    const [hasInternet, sethasInternet] = useState(false)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            sethasInternet(state?.isConnected)
        });

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            <View style={{ flex: 1, backgroundColor: ThemeColors.TOMATO }}>
                <Text>{hasInternet ? 'Internet is connected' : 'Internet is not connected'}</Text>
            </View>
        </>
    )

}