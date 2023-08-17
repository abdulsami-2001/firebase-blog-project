import React, { useRef, useState } from 'react'
import {
    actions,
    defaultActions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { ms } from 'react-native-size-matters';
import { vs } from 'react-native-size-matters';
import storage from '@react-native-firebase/storage'
import { Creators } from '../../Redux/Action/Action';
import DocumentPicker from 'react-native-document-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { showMessage } from 'react-native-flash-message';

const Editor = ({ content, mycontent }) => {
    const RichText = useRef();
    const { height } = Dimensions.get('screen')


    // this function will be called when the editor has been initialized
    function editorInitializedCallback() {
        RichText.current?.registerToolbar(function (items) {
            // items contain all the actions that are currently active
            // console.log(
            //     "Toolbar click, selected items (insert end callback):",
            //     items
            // );
        });
    }

    const imageUploadHandler = async () => {
        try {
            const res = await DocumentPicker.pick({
                // allowMultiSelection: true,
                type: [DocumentPicker.types.images]
            })
            const { uri: path, name: fileName, type: fileType } = res[0]
            const base64String = await RNFetchBlob.fs.readFile(path, 'base64')
            uploadToFBCloudStorage(fileName, base64String, fileType)
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                showMessage({
                    message: "You didn't choose any image",
                    type: "danger",
                })
            }
            else {
                showMessage({
                    message: "Something went wrong",
                    type: "danger",
                })
            }
        }
    }

    const uploadToFBCloudStorage = async (fileName, base64String, fileType) => {
        showMessage({
            message: "Image uploading in process",
            type: "info",
            duration: 3000
        })
        const uploadContent = storage().ref(`allFiles/${fileName}`)
            .putString(base64String, 'base64', { contentType: fileType })
        uploadContent.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            showMessage({
                message: `Image upload is ${progress} % done`,
                type: "info",
            })
            switch (snapshot.state) {
                case 'paused':
                    showMessage({
                        message: `Upload is paused`,
                        description: 'Make sure you have working internet',
                        type: "warning",
                    })
                    break;
                case 'running':
                    showMessage({
                        message: `Upload is running`,
                        type: "info",
                    })
                    console.log('Upload is running');
                    break;
            }
        },
            (error) => {
                // Handle unsuccessful uploads
                showMessage({
                    message: "Something went wrong",
                    type: "warning",
                    duration: 3000,
                })
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadContent.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    // setImageUrl(downloadURL)
                    // you can easily add images from your gallery
                    RichText.current?.insertImage(downloadURL);
                    showMessage({
                        message: "Image Uploaded Successfully",
                        type: "success",
                        duration: 3000,
                    })
                });
            }
        )
    }

    return (
        <View style={STYLES.mainCont}>
            <RichToolbar
                style={STYLES.richBar}
                editor={RichText}
                disabled={false}
                iconTint={ThemeColors.CGREEN}
                selectedIconTint={ThemeColors.WHITE}
                disabledIconTint={ThemeColors.BLACKOPACITY80}
                onPressAddImage={imageUploadHandler}
                iconSize={20}
                actions={[
                    actions.insertImage,
                    ...defaultActions,
                    actions.setStrikethrough,
                    actions.heading1,
                    actions.undo,
                    actions.redo,
                ]}
                // map icons for self made actions
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                        <Text style={[STYLES.tib, { color: tintColor }]}>H1</Text>
                    ),
                    [actions.setStrikethrough]: () => <FontAwesome name={'strikethrough'} color={ThemeColors.CGREEN} size={20} />,
                }}
            />
            <View style={STYLES.subCont(height)} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    <RichEditor
                        disabled={false}
                        containerStyle={STYLES.editor(height)}
                        ref={RichText}
                        style={STYLES.rich}
                        placeholder={"Start Writing Blog Content"}
                        onChange={(text) => mycontent(text)}
                        editorInitializedCallback={editorInitializedCallback}
                        initialContentHTML={content}
                    // scrollEnabled
                    />
                </ScrollView>
            </View>
        </View>
    )
}


const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myallBlogs: Creators.allBlogs,
    mycontent: Creators.content,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        content: state.UserAuth.content,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    richBar: {
        height: 50,
        backgroundColor: ThemeColors.GRAY,
        borderRadius: 10,
        paddingHorizontal: ms(5)
    },
    subCont: (height) => ({
        marginVertical: vs(10),
        height: height / 1.5,
        maxHeight: height / 1.5,
        borderRadius: ms(5),
        padding: ms(5),
    }),
    editor: (height) => ({
        borderRadius: ms(5),
        borderBottomWidth: 1,
        borderBottomColor: ThemeColors.CGREEN,
    }),
    rich: (height) => ({
        height: height / 1.5,
        maxHeight: height / 1.5,
    }),
})
