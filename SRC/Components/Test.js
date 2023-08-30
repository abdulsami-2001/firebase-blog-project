import React, { useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { Card } from 'react-native-paper'
import CustomTextInput from './CustomTextInput'
import { ms, s, vs } from 'react-native-size-matters'
import DocumentPicker from 'react-native-document-picker'
import { showMessage } from 'react-native-flash-message'
import { ThemeColors } from '../Utils/ThemeColors/ThemeColors'
import { StyleSheet, View, Image, useWindowDimensions, TouchableOpacity, TextInput, Button } from 'react-native'

const Test = () => {
    const [Visible, setVisible] = useState(false)
    const { width, height } = useWindowDimensions()
    const [ImageUrl, setImageUrl] = useState('')
    const [imageHeight, setimageHeight] = useState(100)

    const calculateImageHeight = (originalWidth, originalHeight, newWidth) => {
        console.log(originalWidth, originalHeight, newWidth)

        return (newWidth * originalHeight) / originalWidth;
    };

    const imageUploadHandler = async () => {
        try {
            const res = await DocumentPicker.pick({
                // allowMultiSelection: true,
                type: [DocumentPicker.types.images]
            })
            const { uri: path, name: fileName, type: fileType } = res[0]

            const cardWidth = width - ms(30); // Adjust as needed
            const imageWidth = cardWidth;
            var originalImageWidth;
            var originalImageHeight;

            Image.getSize(path, (width, height) => {
                console.log('width ', width);
                console.log('height ', height);

                originalImageWidth = width /* Get the actual image width */
                originalImageHeight = height /* Get the actual image height */


                const imageHeight = calculateImageHeight(
                    originalImageWidth,
                    originalImageHeight,
                    imageWidth
                );
                console.log('imageHeight ', imageHeight)
                setimageHeight(imageHeight)

            }, (error) => {
                console.error('Error getting image dimensions:', error);
            });

            setImageUrl(path)


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
            <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                <TouchableOpacity style={STYLES.cardCont(width)} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.BLOG, item)}>
                    <Card style={STYLES.card}>
                        <Card.Cover style={{ ...STYLES.coverImg, height: imageHeight }} source={{ uri: ImageUrl }} resizeMode='contain' />
                    </Card>
                </TouchableOpacity>
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
    cardCont: (width) => ({
        marginVertical: vs(2),
        width: width - ms(30),
    }),
    card: {
        // Add your card styles here
    },
    coverImg: {
        // Add your cover image styles here
    },
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



