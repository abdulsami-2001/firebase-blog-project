import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { ThemeColors } from '../Utils/ThemeColors/ThemeColors'
import { ms, vs } from 'react-native-size-matters'
import CustomTextInput from './CustomTextInput'
import DocumentPicker from 'react-native-document-picker'
import { showMessage } from 'react-native-flash-message'
import RNFetchBlob from 'rn-fetch-blob'

const Test = () => {
    const [Visible, setVisible] = useState(false)


    const imageUploadHandler = async () => {
        try {
            const res = await DocumentPicker.pick({
                // allowMultiSelection: true,
                type: [DocumentPicker.types.images]
            })
            const { uri: path, name: fileName, type: fileType } = res[0]

            Image.getSize(path, (width, height) => {
                console.log('width ', width);
                console.log('height ', height);
            }, (error) => {
                console.error('Error getting image dimensions:', error);
            });

            // console.log('path ', path)


            const base64String = await RNFetchBlob.fs.readFile(path, 'base64')
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                showMessage({
                    message: "You didn't choose any image",
                    type: "warning",
                    duration: 3000,
                })
            }
            else {
                console.log("Error while doc pick", error)
                showMessage({
                    message: "Something went wrong",
                    type: "danger",
                })
            }
        }
    }

    return (
        <>
            <View>
                <Button title='Upload Image' onPress={imageUploadHandler} />
            </View>
        </>
    )


    // return (
    //     <View style={STYLES.mainCont}>
    //         <Modal
    //             animationType='slide'
    //             visible={Visible}
    //             transparent={true}
    //         >
    //             <View style={STYLES.modalCont} >
    //                 <View style={STYLES.modalSubCont} >
    //                     <Text>Hello</Text>
    //                     <TouchableOpacity onPress={() => setVisible(false)} >
    //                         <Text>Band Kro</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </Modal>
    //         <TouchableOpacity onPress={() => setVisible(true)} >
    //             <Text>Click</Text>
    //         </TouchableOpacity>
    //     </View>
    // )


}


export default Test

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        backgroundColor: ThemeColors.WHITE,
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



