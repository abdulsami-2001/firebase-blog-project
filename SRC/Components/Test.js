import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { ThemeColors } from '../Utils/ThemeColors/ThemeColors'
import { ms, vs } from 'react-native-size-matters'
import CustomTextInput from './CustomTextInput'

const Test = () => {
    const [Visible, setVisible] = useState(false)


    return (
        <View style={STYLES.mainCont}>
            <Modal
                animationType='slide'
                visible={Visible}
                transparent={true}
            >
                <View style={STYLES.modalCont} >
                    <View style={STYLES.modalSubCont} >
                        <Text>Hello</Text>
                        <TouchableOpacity onPress={() => setVisible(false)} >
                            <Text>Band Kro</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => setVisible(true)} >
                <Text>Click</Text>
            </TouchableOpacity>
        </View>
    )


}


export default Test

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        backgroundColor: ThemeColors.CADETBLUE,
    },
    modalCont: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: "center",
        // alignItems: 'center',
    },
    modalSubCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'purple'
    },
})



