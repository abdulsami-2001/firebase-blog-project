import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'
import Lottie from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RenderHtml from 'react-native-render-html'
import { Creators } from '../../Redux/Action/Action'
import { ms, mvs, vs } from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import { useNavigation } from '@react-navigation/native'
import storage from '@react-native-firebase/storage'
import DocumentPicker from 'react-native-document-picker'
import { TextInput, Button, useTheme } from 'react-native-paper'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'

const AddBlog = ({ isUserLoggedIn, userIdentification, myuserBlogs, Content, myContent, userFromStore }) => {
    const [Title, setTitle] = useState("");
    const [Author, setAuthor] = useState(userFromStore?.displayName);
    const [ImageUrl, setImageUrl] = useState('')
    const { width, height } = Dimensions.get('screen')
    const theme = useTheme()
    const navigation = useNavigation()

    useEffect(() => {
        setAuthor(userFromStore?.displayName)
        console.log('use effect add blog')
    }, [userFromStore])

    console.log('re rednere add blog')


    const generateKey = (title) => {
        return `${title}_${new Date().getTime()}`;

    }
    const publishHandler = () => {
        if (Title != '' && Content != '' && Author != '' && ImageUrl != '') {
            // run func
            getDataFromFirestore()
            showMessage({
                message: "Publishing is in process",
                type: "info",
            });
        } else if (Content == '' && Title == '' && Author == '') {
            showMessage({
                message: "All inputs are empty.",
                type: "warning",
            });
        } else if (Title == '') {
            showMessage({
                message: "Title is empty.",
                type: "warning",
            });
        } else if (Content == '') {
            showMessage({
                message: "Content is empty.",
                type: "warning",
            });
        }
        else if (Author == '') {
            showMessage({
                message: "Author is empty.",
                type: "warning",
            });
        }
        else if (ImageUrl == '') {
            showMessage({
                message: "Blog cover image  is not uploaded.",
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
                type: [DocumentPicker.types.images]
            })
            const { uri: path, name: fileName, type: fileType } = res[0]
            const base64String = await RNFetchBlob.fs.readFile(path, 'base64')
            uploadToFBCloudStorage(fileName, base64String, fileType)
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
                    [Title]: {
                        Title,
                        Content,
                        Author,
                        ImageUrl,
                        BlogId: generateKey(Title)
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Blog Added',
                        type: 'success'
                    })
                    myuserBlogs({
                        [Title]: {
                            Title,
                            Content,
                            Author,
                            ImageUrl,
                            BlogId: generateKey(Title)
                        }
                    })
                    navigation.navigate(NavigationStrings.MYBLOGS)
                    setTitle('')
                    setAuthor('')
                    myContent('')
                    setImageUrl('')
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while uploading blogs',
                description: "Make sure you have working internet",
                type: 'warning'
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
                    [Title]: {
                        Title,
                        Content,
                        Author,
                        ImageUrl,
                        BlogId: generateKey(Title)
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 2000,
                        message: 'Blog Added',
                        type: 'success'
                    })
                    myuserBlogs({
                        [Title]: {
                            Title,
                            Content,
                            Author,
                            ImageUrl,
                            BlogId: generateKey(Title)
                        },
                        ...data,
                    })
                    navigation.navigate(NavigationStrings.MYBLOGS)
                    setTitle('')
                    setAuthor('')
                    myContent('')
                    setImageUrl('')
                });
        } catch (error) {
            showMessage({
                duration: 2000,
                message: 'Error while uploading blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const getDataFromFirestore = async () => {
        try {
            const { _data: data } = await firestore()?.collection('Users')?.doc(userIdentification)?.get()

            if (data == undefined) {
                // First blog of user                    
                uploadDataToFirestore()
            } else if (data != undefined) {
                // Already post min one blog                    
                updateDataToFirestore(data)
            } else {
                showMessage({
                    duration: 2000,
                    message: "Make sure you have working internet",
                    type: 'warning',
                })
            }
        } catch (error) {
            showMessage({
                duration: 2000,
                message: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    if (isUserLoggedIn) {
        return (
            <View style={STYLES.mainCont}>
                <TouchableOpacity style={STYLES.iconCont} activeOpacity={0.7} onPress={() => navigation.navigate(NavigationStrings.EDITOR)}>
                    <MaterialCommunityIcons name='pencil' color={ThemeColors.CGREEN} size={40} />
                </TouchableOpacity>
                {ImageUrl == '' &&
                    <TouchableOpacity style={[STYLES.iconCont, { bottom: 75 }]} activeOpacity={0.7} onPress={imageUploadHandler}>
                        <MaterialCommunityIcons name='image-plus' color={ThemeColors.CGREEN} size={40} />
                    </TouchableOpacity>
                }
                <ScrollView showsVerticalScrollIndicator={false}  >
                    <View style={STYLES.inputCont}>
                        <TextInput
                            label="Title"
                            value={Title}
                            type='outlined'
                            onChangeText={text => setTitle(text)}
                            style={STYLES.input}
                        />
                        <ScrollView style={STYLES.htmlView(theme)} horizontal>
                            <RenderHtml
                                source={{ html: Content != '' ? Content : 'Click on edit icon to write a blog' }}
                                contentWidth={width}
                            />
                        </ScrollView>
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
                            <Image source={{ uri: ImageUrl }} width={200} height={200} />
                        </View>
                    }
                </ScrollView>
            </View>
        )
    } else {
        return (
            <View style={STYLES.mainContNL}>
                <View style={STYLES.lottieCont(width, height)} >
                    <Lottie source={require('../../Assets/Lottie/announcement.json')} style={STYLES.lottie(width, height)} autoPlay loop speed={0.5} />
                </View>
                <View style={STYLES.headingCont} >
                    <Text style={STYLES.heading} >You're not logged in.</Text>
                    <Text style={STYLES.heading} >Login/signup is required.</Text>
                </View>
            </View>
        )
    }
}


const mapDispatchToProps = {
    myUserState: Creators.userState,
    myUserId: Creators.userId,
    myuserBlogs: Creators.userBlogs,
    myuserFavorites: Creators.userFavorites,
    myallBlogs: Creators.allBlogs,
    myContent: Creators.content,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFavorites: state.UserAuth.userFavorites,
        Content: state.UserAuth.content,
        userFromStore: state.UserAuth.user,
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
    htmlView: (theme) => ({
        backgroundColor: theme.colors.primaryContainer,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        borderBottomWidth: 0.5,
        // padding: ms(15),

    }),
    headingCont: {
        marginVertical: vs(20),
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        color: ThemeColors.GRAY
    },
    input: {
        marginVertical: vs(8),
    },
    imgCont: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: mvs(10)
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    },
    lottieCont: (width, height) => ({
        width: width,
        height: height / 4,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    iconCont: {
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 20,
        backgroundColor: ThemeColors.WHITE,
        borderRadius: 50,
    }
})