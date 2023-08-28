import React, { useState } from 'react'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from 'react-native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'

const LoginDemo = () => {
    const [email, setemail] = useState('myEmail')
    const [password, setpassword] = useState('myPassword')

    const handelPress = () => {
        setemail(email)
        setpassword(password)
    }

    return (
        <>
            <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <TextInput
                    value={email}
                    keyboardType='email-address'
                    onChangeText={text => setemail(text)}
                    style={{
                        backgroundColor: ThemeColors.PINK,
                        borderWidth: 1,
                        marginBottom: 5,
                    }}
                    testID='email'
                />
                <TextInput
                    keyboardType='email-address'
                    testID='password'
                    value={password}
                    onChangeText={text => setpassword(text)}
                    style={{
                        backgroundColor: ThemeColors.PINK,
                        borderWidth: 1,
                        marginBottom: 5,
                    }}
                />
                <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: "center", backgroundColor: ThemeColors.LIGHTGRAY }}>
                    <Text testID='emailText'>{email}</Text>
                    <Text testID='passwordText'>{password}</Text>
                </View>
                <TouchableOpacity testID='login' style={{ backgroundColor: ThemeColors.TOMATO, padding: 10 }} onPress={() => handelPress()} >
                    <Text>
                        {NavigationStrings.LOGIN}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default LoginDemo

const styles = StyleSheet.create({})