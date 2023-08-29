import React, { useState } from 'react'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import { Text, ScrollView, TextInput, View, TouchableOpacity } from 'react-native'

const ForgetPasswordDemo = () => {
    const [Email, SetEmail] = useState('')
    const [ValidEmail, setValidEmail] = useState(false)

    const emails = [
        "example@example.com",
        "invalid-email",
        "missing.at.example.com",
        "@invalid.com",
        "invalid@.com",
        "invalid.email@",
    ];

    const isValidEmail = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(email)) {
            if (!/@/.test(email)) {
                setValidEmail("Invalid: Missing @ symbol");
            } else if (email.indexOf("@") === 0) {
                setValidEmail("Invalid: @ cannot be the first character");
            } else if (email.indexOf("@") === email.length - 1) {
                setValidEmail("Invalid: @ cannot be the last character");
            } else if (email.indexOf(".") === -1) {
                setValidEmail("Invalid: Domain extension missing");
            } else {
                setValidEmail("Invalid email format");
            }
        } else if (emailRegex.test(email)) {
            setValidEmail('Valid Email Address');
        }

    }



    return (
        <View style={{ backgroundColor: ThemeColors.WHITE, flex: 1, }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: ThemeColors.WHITE }}>
                    <TextInput
                        value={Email}
                        testID='email'
                        placeholder='Enter valid email to recieve code'
                        keyboardType='email-address'
                        onChangeText={text => SetEmail(text)}
                        style={{ backgroundColor: ThemeColors.LIGHTGRAY, borderWidth: 1, marginBottom: 10 }}
                    />
                    <View style={{ backgroundColor: ThemeColors.LIGHTGRAY }}>
                        <TouchableOpacity
                            testID='Request Code'
                            style={{ backgroundColor: ThemeColors.TOMATO, padding: 10 }}
                            onPress={() => isValidEmail(Email)} >
                            <Text>
                                Request Code
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text testID='result' >Email: {ValidEmail}</Text>

                </View>
            </ScrollView>
        </View>)
}

export default ForgetPasswordDemo