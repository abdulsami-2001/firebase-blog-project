import { StyleSheet, Text, View, ScrollView, Button, Dimensions, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState } from 'react'
import {
    actions,
    defaultActions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import HTMLView from "react-native-htmlview";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux';
import { Creators } from '../../Redux/Action/Action';
import { ms } from 'react-native-size-matters';
import { vs } from 'react-native-size-matters';
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors';

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

    // Callback after height change
    function handleHeightChange(height) {
        // console.log("editor height change:", height);
    }

    function onPressAddImage() {
        // you can easily add images from your gallery
        RichText.current?.insertImage(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
        );
    }

    function insertVideo() {
        // you can easily add videos from your gallery
        RichText.current?.insertVideo(
            "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4"
        );
    }


    console.log("content: ", content)
    return (
        <View style={STYLES.mainCont}>
            <RichToolbar
                style={STYLES.richBar}
                editor={RichText}
                disabled={false}
                iconTint={ThemeColors.CGREEN}
                selectedIconTint={ThemeColors.WHITE}
                disabledIconTint={"purple"}
                onPressAddImage={onPressAddImage}
                iconSize={20}
                actions={[
                    ...defaultActions,
                    actions.setStrikethrough,
                    actions.heading1,
                    "insertVideo",
                ]}
                // map icons for self made actions
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                        <Text style={[STYLES.tib, { color: tintColor }]}>H1</Text>
                    ),
                    [actions.setStrikethrough]: () => <FontAwesome name={'strikethrough'} color={ThemeColors.CGREEN} size={20} />,
                    ["insertVideo"]: () => <FontAwesome name={'camera'} color={ThemeColors.CGREEN} size={20} />,
                }}
                insertVideo={insertVideo}
            />
            <View style={STYLES.subCont(height)} >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <RichEditor
                            disabled={false}
                            containerStyle={STYLES.editor(height)}
                            ref={RichText}
                            style={STYLES.rich}
                            placeholder={"Start Writing Here"}
                            onChange={(text) => mycontent(text)}
                            editorInitializedCallback={editorInitializedCallback}
                            onHeightChange={handleHeightChange}
                            initialContentHTML={content}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}


const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myuserFavorites: Creators.userFavorites,
    myallBlogs: Creators.allBlogs,
    mycontent: Creators.content,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFavorites: state.UserAuth.userFavorites,
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
        // borderWidth: 1,
        marginVertical: vs(10),
        // backgroundColor: ThemeColors.PINK,
        height: height / 1.5,
        maxHeight: height / 1.5,
        borderRadius: ms(5),
        padding: ms(5)
    }),
    editor: (height) => ({
        // borderWidth: 1,
        // backgroundColor: ThemeColors.ORANGE,
        // height: height / 1.5,
        // maxHeight: height / 1.5,
        borderRadius: ms(5),

    }),
    rich: (height) => ({
        height: height / 1.5,
        maxHeight: height / 1.5,
        // borderWidth:1,
        color: ThemeColors.PURPLE
    }),
})
