import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import {
    actions,
    defaultActions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import HTMLView from "react-native-htmlview";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Test = () => {
    // const strikethrough = require("./assets/strikethrough.png"); //icon for strikethrough
    // const video = require("./assets/video.png"); //icon for Addvideo
    const RichText = useRef();
    const [article, setArticle] = useState("");

    // this function will be called when the editor has been initialized
    function editorInitializedCallback() {
        RichText.current?.registerToolbar(function (items) {
            // items contain all the actions that are currently active
            console.log(
                "Toolbar click, selected items (insert end callback):",
                items
            );
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


    return (
        <ScrollView style={styles.container}>
            {/* <HTMLView value={article} stylesheet={styles} /> */}

            <Text style={styles.text}>Editor</Text>
            <RichEditor
                disabled={false}
                // containerStyle={styles.editor}
                ref={RichText}
                style={styles.rich}
                placeholder={"Start Writing Here"}
                onChange={(text) => setArticle(text)}
                editorInitializedCallback={editorInitializedCallback}
                onHeightChange={handleHeightChange}
            />
            <RichToolbar
                style={[styles.richBar]}
                editor={RichText}
                disabled={false}
                iconTint={"purple"}
                selectedIconTint={"pink"}
                disabledIconTint={"purple"}
                onPressAddImage={onPressAddImage}
                iconSize={40}
                actions={[
                    "insertVideo",
                    ...defaultActions,
                    actions.setStrikethrough,
                    actions.heading1,
                ]}
                // map icons for self made actions
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                        <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
                    ),
                    [actions.setStrikethrough]: () => <FontAwesome name={'strikethrough'} color={'purple'} />,
                    ["insertVideo"]: () => <FontAwesome name={'camera'} color={'purple'} />,
                }}
                insertVideo={insertVideo}
            />
            {/* <Text style={styles.text}>Result</Text> */}
        </ScrollView>
    );
};

export default Test

const styles = StyleSheet.create({
    /********************************/
    /* styles for html tags */
    a: {
        fontWeight: "bold",
        color: "purple",
    },
    div: {
        fontFamily: "monospace",
    },
    p: {
        fontSize: 30,
    },
    /*******************************/
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: "#F5FCFF",
    },
    editor: {
        backgroundColor: "black",
        borderColor: "black",
        borderWidth: 4,
        minHeight: 300,

    },
    rich: {
        // minHeight: 300,
        flex: 1,
    },
    richBar: {
        height: 50,
        backgroundColor: "#F5FCFF",
    },
    text: {
        fontWeight: "bold",
        fontSize: 20,
    },
    tib: {
        textAlign: "center",
        color: "#515156",
    },
});




// import { StyleSheet, Text, View, Button, Image } from 'react-native'
// import React, { useState } from 'react'
// import { Types, Creators } from '../Redux/Action/Action'
// import { connect } from 'react-redux'
// import storage from '@react-native-firebase/storage';
// import firestore from '@react-native-firebase/firestore';
// import { showMessage } from 'react-native-flash-message';


// const Test = ({ isUserLoggedIn, myUserState }) => {
//     const [Img, setImg] = useState(null)
//     // console.log("isUserLoggedIn ", isUserLoggedIn)
//     // console.log("Creators ", Creators)
//     // console.log("Types ", Types)

//     // const referenceHandler = async () => {
//     //     const reference = storage().ref('black-t-shirt-sm.png');
//     //     console.log(reference)
//     // }

//     // console.log(Img)

//     const cloudFirestoreHandler = async () => {
//         const { _data } = await firestore().collection('Blogs')?.doc('test')?.get();
//         console.log(_data?.img?._documentPath?._parts[0])
//         setImg(_data?.img?._documentPath?._parts[0])
//     }

//     const getDataFromFirestore = async () => {
//         try {
//             // const data = firestore()?.collection().where().get()
//             let data = []
//             const dataRef = firestore().collection('Users');
//             const snapshot = await dataRef.get();
//             snapshot.forEach(doc => {
//                 data.push(doc.data())
//             });

//             console.log(data)

//             // if (data != undefined) {
//             //     // setDataFromServer(data)
//             // } else {
//             //     // setDataFromServer({})
//             //     showMessage({
//             //         duration: 2000,
//             //         message: 'Error while fetching blogs',
//             //         description: "Make sure you have working internet",
//             //     })
//             // }

//         } catch (error) {
//             console.log(error)
//             showMessage({
//                 duration: 2000,
//                 message: 'Error while fetching blogs',
//                 description: "Make sure you have working internet -c",
//             })
//         }
//     }

//     return (
//         <View>
//             <Text>Test</Text>
//             <Button title='change' onPress={() => myUserState(!isUserLoggedIn)} />
//             {/* <Button title='create Reference' onPress={() => referenceHandler()} /> */}
//             <Button title='fetch from firestore' onPress={() => getDataFromFirestore()} />
//             <Image source={{ uri: Img }} width={100} height={100} />
//         </View>
//     )
// }


// const mapDispatchToProps = {
//     myUserState: Creators.userState,
// }

// const mapStateToProps = (state) => {
//     return {
//         isUserLoggedIn: state.UserAuth.isUserLoggedIn
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Test)

// const styles = StyleSheet.create({})