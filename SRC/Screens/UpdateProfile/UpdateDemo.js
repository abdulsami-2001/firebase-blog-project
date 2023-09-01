import React, { useState } from 'react'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'

const UpdateDemo = () => {
    const [NewName, setNewName] = useState('')

    const nameUpdateHandler = () => {
        // if (NewName === '') {
        //     return "New Name can't be empty"
        // } else if (NewName != '') {
        //     updateName()

        // } else {
        //     return 'some thing went wrong'
        // }
    }

    const updateName = async () => {

        // auth()?.currentUser.updateProfile({
        //     displayName: NewName
        // }).then(() => {
        //     return "Name Update Successfully"
        // }).catch(error => {
        //     return "Name Update Unsuccessfully"
        // });
    }



    return (
        <>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <TextInput
                    value={NewName}
                    keyboardType='email-address'
                    onChangeText={text => setNewName(text)}
                    placeholder='New Names'
                    testID='NewNameTI'
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        backgroundColor: ThemeColors.LIGHTGRAY,
                    }}
                />
                <TouchableOpacity testID='button' style={{ backgroundColor: ThemeColors.TOMATO, padding: 10 }} onPress={() => nameUpdateHandler()} >
                    <Text>
                        Update Name
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default UpdateDemo