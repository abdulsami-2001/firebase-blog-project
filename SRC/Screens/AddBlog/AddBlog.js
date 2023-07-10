import React, { useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import storage from '@react-native-firebase/storage'
import { TextInput,Button } from 'react-native-paper'
import { ms, mvs, vs } from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import DocumentPicker from 'react-native-document-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, Text, View, ScrollView,  Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Creators } from '../../Redux/Action/Action'
import { useNavigation } from '@react-navigation/native'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'


const AddBlog = ({isUserLoggedIn, userIdentification, userBlogs,myuserBlogs }) => {
    const [Title, setTitle] = useState("");
    const [Content, setContent] = useState("");
    const [Author, setAuthor] = useState("");
    const [ImageUrl, setImageUrl] = useState('')

    const navigation = useNavigation()

    const publishHandler = () => {
        if (Title != '' && Content != '' && Author != '' && ImageUrl != '') {
            // run func
            getDataFromFirestore()
            showMessage({
                message: "Publishing is in process",
                type: "info",
            });
        } else if (Content  == '' && Title == ''&& Author == '') {
            showMessage({
                message: "All inputs are empty.",
                type: "warning",
            });
        }else if (Title  == '') {
            showMessage({
                message: "Title is empty.",
                type: "warning",
            });
        }else if (Content  == '') {
            showMessage({
                message: "Content is empty.",
                type: "warning",
            });
        }
        else if (Author  == '') {
            showMessage({
                message: "Author is empty.",
                type: "warning",
            });
        }else if (ImageUrl  == '') {
            showMessage({
                message: "Image is not uploaded.",
                type: "warning",
            });
        }
        else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
            });
        }
    }
    
    const imageUploadHandler = async () => {
        try { 
            const res = await DocumentPicker.pick({
                // allowMultiSelection: true,
                type: [DocumentPicker.types.allFiles]
            })
            const {uri: path, name: fileName, type: fileType} = res[0]
            const base64String = await RNFetchBlob.fs.readFile(path, 'base64')
            uploadToFBCloudStorage(fileName, base64String,fileType)
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                showMessage({
                    message: "You didn't choose any image.",
                    type: "danger",
                })
            }
            else {
                showMessage({
                    message: "Something went wrong",
                    type: "danger",
                })
                console.log(error)
            }
        }

    }

    const uploadToFBCloudStorage = async (fileName, base64String,fileType) => {
        showMessage({
            message: "Image uploading in process",
            type: "info",
            duration: 3000
        })
        const uploadContent = storage().ref(`allFiles/${fileName}`)
        .putString(base64String, 'base64', {contentType:fileType})
        uploadContent.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error)
            showMessage({
                message: "Something went wrong",
                description: error.message,
                type: "warning",
            })
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadContent.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                setImageUrl(downloadURL)
                showMessage({
                    message: "Image Uploaded Successfully.",
                    type: "success",
                })
            });
        }
        )
    }
    
    const uploadDataToFirestore = async () => {
        try {   
            firestore()
            .collection('Users')
            .doc(userIdentification)
            .set({
                [Title] : {
                    Title,
                    Content,
                    Author,
                    ImageUrl
                }
            })
            .then(() => {
                showMessage({
                    duration: 2000,
                    message: 'Blog Added',
                    type:'success'
                })
                myuserBlogs({
                        [Title] : {
                            Title,
                            Content,
                            Author,
                            ImageUrl
                        }
                })
                navigation.navigate(NavigationStrings.MYBLOGS)
                setTitle('')
                setAuthor('')
                setContent('')
                setImageUrl('')
            });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while uploading blogs',
                description: "Make sure you have working internet",
                type:'warning'
            })
        }
    }

    const updateDataToFirestore = async (data) => {
        try {   
            firestore()
            .collection('Users')
            .doc(userIdentification)
            .update({
                ...data,
                [Title] : {
                    Title,
                    Content,
                    Author,
                    ImageUrl
                }
            })
            .then(() => {
                showMessage({
                    duration: 2000,
                    message: 'Blog Added',
                    type:'success'
                })
                myuserBlogs({
                    [Title] : {
                        Title,
                        Content,
                        Author,
                        ImageUrl
                    },
                    ...data,
                })
                navigation.navigate(NavigationStrings.MYBLOGS)
                setTitle('')
                setAuthor('')
                setContent('')
                setImageUrl('')
            });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while uploading blogs',
                description: "Make sure you have working internet",
                type:'warning'
            })
        }
    }

    const getDataFromFirestore = async () => {
            try {
                const { _data: data } = await firestore()?.collection('Users')?.doc(userIdentification)?.get()
    
                console.log(data)

                if (data == undefined) {
                    // First blog of user                    
                    uploadDataToFirestore()
                }else if(data != undefined){
                    // Already post min one blog                    
                    updateDataToFirestore(data)

                } else {
                    showMessage({
                        duration: 2000,
                        message: "Make sure you have working internet",
                    })
                }
    
            } catch (error) {
                showMessage({
                    duration: 2000,
                    message: "Make sure you have working internet",
                })
            }
    }

    if (isUserLoggedIn) {
        return (
            <View style={STYLES.mainCont}>
                    {ImageUrl == '' && 
                        <TouchableOpacity style={STYLES.iconCont} activeOpacity={0.7} onPress={imageUploadHandler}>
                            <MaterialCommunityIcons name='image-plus' color={ThemeColors.CGREEN} size={50} />
                        </TouchableOpacity>
                    }
                <ScrollView >
                    <View style={STYLES.headingCont}>
                        <Text style={STYLES.heading}>Write a blog</Text>
                    </View>
                    <View style={STYLES.inputCont}>
                        <TextInput
                            label="Title"
                            value={Title}
                            type='outlined'
                            onChangeText={text => setTitle(text)}
                            style={STYLES.input}
                        />
                        <TextInput
                            label="Blog content"
                            value={Content}
                            type='outlined'
                            multiline
                            onChangeText={text => setContent(text)}
                            style={STYLES.input}
                        />
                        <TextInput
                            label="Author"
                            value={Author}
                            type='outlined'
                            onChangeText={text => setAuthor(text)}
                            style={STYLES.input}
                        />
                    </View>
                    <Button 
                        mode="contained" 
                        style={STYLES.btn} 
                        onPress={publishHandler}
                    >
                        Publish Blog
                    </Button>
                    {ImageUrl != '' && 
                    <View style={STYLES.imgCont} >
                        <Image source={{uri:ImageUrl}} width={200} height={200} /> 
                    </View> 
                    }
                </ScrollView>
            </View>
        )
    } else {
        return(
            <View style={STYLES.mainContNL}>
                <View style={STYLES.headingCont}>
                <Text style={STYLES.heading} >You're not logged in.</Text>
                <Text style={STYLES.heading} >Do login/signup from profile</Text>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = {
    myUserState: Creators.userState,
    myuserBlogs: Creators.userBlogs,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
        userBlogs: state.UserAuth.userBlogs,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddBlog)


const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
    },
    mainContNL: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        justifyContent: 'center',
    },
    headingCont: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 22
    },
    input: {
        marginVertical: vs(8),
    },
    imgCont: {
        justifyContent:'center',
        alignItems:'center',
        marginVertical:mvs(10)
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN

    },
    iconCont:{
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 20,
        backgroundColor: ThemeColors.WHITE,
        borderRadius: 50,
    }
})

// Extra Code

// let base64String = []
// res.filter(async (item, index) => {
//     base64String.push(await RNFetchBlob.fs.readFile(item.uri, 'base64'))

    
// })


// const getDataFromFirestore = async () => {
//     try {
//         const { _data: data } = await firestore()?.collection('Blogs')?.doc('test')?.get()
//         console.log(data)
//         if (data != undefined) {
//             // setDataFromServer(data)
//         } else {
//             // setDataFromServer({})
//             showMessage({
//                 duration: 2000,
//                 message: 'Error while fetching blogs',
//                 description: "Make sure you have working internet",
//             })
//         }
//     } catch (error) {
//         showMessage({
//             duration: 2000,
//             message: 'Error while fetching blogs',
//             description: "Make sure you have working internet",
//         })
//     }
// }
