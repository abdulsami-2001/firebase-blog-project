import React from 'react'
import { ms, vs } from 'react-native-size-matters'
import { StyleSheet, TextInput, } from 'react-native'

const CustomTextInput = ({ Value, setValue, placeholder, width, height, borderRadius, extraStyles }) => {
    return (
        <TextInput
            value={Value}
            onChangeText={(text) => setValue(text)}
            placeholder={placeholder ? placeholder : 'dummy'}
            style={STYLES.textInput(width, height, borderRadius, extraStyles)}
        />
    )
}

export default CustomTextInput

const STYLES = StyleSheet.create({
    textInput: (customWidth, customHeight, customBorderRadius, extraStyles) => ({
        width: customWidth ? customWidth : ms(250),
        height: customHeight ? customHeight : vs(60),
        borderRadius: customBorderRadius ? customBorderRadius : ms(20),
        borderWidth: 1,
        alignSelf: 'center',
        marginVertical: vs(5),
        ...extraStyles,
    })
})