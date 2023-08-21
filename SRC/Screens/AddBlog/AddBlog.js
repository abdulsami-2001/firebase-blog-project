import { connect } from 'react-redux'
import { Dimensions } from 'react-native'
import Lottie from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import React, { useState, useEffect } from 'react'
import { Creators } from '../../Redux/Action/Action'
import storage from '@react-native-firebase/storage'
import { ms, mvs, vs } from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import { useNavigation } from '@react-navigation/native'
import DocumentPicker from 'react-native-document-picker'
import { TextInput, Button, Card, Avatar } from 'react-native-paper'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import NavigationStrings from '../../Utils/NavigationStrings/NavigationStrings'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { generateKey } from '../../Utils/ReusableFunctions/ReusableFunctions';

const AddBlog = ({ route, isUserLoggedIn, userIdentification, myuserBlogs, Content, myContent, userFromStore }) => {

    const navigation = useNavigation()
    const { width, height } = Dimensions.get('screen')

    const [Title, setTitle] = useState("");
    const [ImageUrl, setImageUrl] = useState('')
    const [Author, setAuthor] = useState(userFromStore?.displayName);

    const { params } = route

    useEffect(() => {
        setAuthor(userFromStore?.displayName)
    }, [userFromStore])


    useEffect(() => {
        let tempContent = Content
        if (isUserLoggedIn && params?.editAuthor) {
            setImageUrl(params?.editImageUrl)
            setTitle(params?.editTitle)
            setAuthor(params?.editAuthor)
            myContent(params?.editContent)
        }

        return () => {
            if (isUserLoggedIn && params?.editAuthor) {
                myContent(tempContent)
                setImageUrl('')
                setTitle('')
                setAuthor(userFromStore?.displayName)
            }
        }
    }, [])


    const publishHandler = (isEditing) => {
        if (Title != '' && Content != '' && Author != '' && ImageUrl != '') {
            // run func
            getDataFromFirestore(isEditing)
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

    const getDataFromFirestore = async (isEditing) => {
        try {
            const { _data: data } = await firestore()?.collection('Users')?.doc(userIdentification)?.get()

            if (data == undefined) {
                // First blog of user                    
                uploadDataToFirestore()
            } else if (data != undefined) {
                // Already post min one blog                    
                isEditing ? editDataToFirestore(data) : updateDataToFirestore(data)
            } else {
                showMessage({
                    duration: 3000,
                    message: "Make sure you have working internet",
                    type: 'warning',
                })
            }
        } catch (error) {
            showMessage({
                duration: 3000,
                message: "Make sure you have working internet",
                type: 'warning',
            })
        }
    }

    const uploadDataToFirestore = async () => {
        const BlogId = generateKey(Title)

        try {
            firestore()
                .collection('Users')
                .doc(userIdentification)
                .set({
                    [BlogId]: {
                        Title,
                        Content,
                        Author,
                        ImageUrl,
                        FavByUser: [],
                        BlogId: BlogId,
                        uid: userIdentification,
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 3000,
                        message: 'Blog Added',
                        type: 'success'
                    })
                    myuserBlogs({
                        [BlogId]: {
                            Title,
                            Author,
                            Content,
                            ImageUrl,
                            FavByUser: [],
                            BlogId: BlogId,
                            uid: userIdentification,
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
                duration: 3000,
                message: 'Error while uploading blogs',
                description: "Make sure you have working internet",
                type: 'warning'
            })
        }
    }

    const updateDataToFirestore = async (data) => {
        const BlogId = generateKey(Title)
        try {
            firestore()
                .collection('Users')
                .doc(userIdentification)
                .update({
                    ...data,
                    [BlogId]: {
                        Title,
                        Author,
                        Content,
                        ImageUrl,
                        FavByUser: [],
                        BlogId: BlogId,
                        uid: userIdentification,
                    }
                })
                .then(() => {
                    showMessage({
                        duration: 3000,
                        message: 'Blog Added',
                        type: 'success'
                    })
                    myuserBlogs({
                        [BlogId]: {
                            Title,
                            Content,
                            Author,
                            ImageUrl,
                            FavByUser: [],
                            BlogId: BlogId,
                            uid: userIdentification,
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
            showMessage({ duration: 3000, message: 'Error while uploading blogs', description: "Make sure you have working internet", type: 'warning' })
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
                    message: "You didn't choose any image",
                    type: "warning",
                    duration: 3000,
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

    // for editing existing blog post

    const editDataToFirestore = (data) => {
        let myObj = {
            ...data,
            [params?.editBlogId]: {
                Title,
                Content,
                Author,
                ImageUrl,
                BlogId: params?.editBlogId,
                FavByUser: params?.editFavByUser,
                uid: params?.editUserIdentification,
            }
        }
        try {
            const docRef = firestore()
                .collection('Users')
                .doc(userIdentification)
            docRef.set({ ...myObj }, { merge: true })
                .then(() => {
                    showMessage({
                        duration: 3000,
                        message: 'Blog Edited',
                        type: 'success'
                    })
                    myuserBlogs({
                        ...myObj
                    })

                    navigation.navigate(NavigationStrings.MYBLOGS)
                    setTitle('')
                    setAuthor('')
                    myContent('')
                    setImageUrl('')
                });
        } catch (error) {
            showMessage({ duration: 3000, message: 'Blog Edit Fail', description: 'Try again later', type: 'warning' })
        }
    }

    if (isUserLoggedIn) {
        return (
            <View style={STYLES.mainCont}>
                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} >
                    <Card>
                        {ImageUrl != '' &&
                            <>
                                <View style={{ position: 'relative' }} >
                                    <Card.Cover source={{ uri: ImageUrl }} resizeMode='contain' />
                                    <TouchableOpacity style={STYLES.editIconCont} onPress={imageUploadHandler} >
                                        <Avatar.Icon size={35} color={ThemeColors.WHITE} icon={'pencil'} style={STYLES.editIcon} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                        {ImageUrl == '' && <TouchableOpacity onPress={imageUploadHandler} activeOpacity={0.3} style={STYLES.coverImgCont}>
                            <Avatar.Icon size={190} color={ThemeColors.WHITE} icon={'image-edit'} style={STYLES.editIcon} />
                        </TouchableOpacity>}
                    </Card>
                    <View style={STYLES.inputCont}>
                        <TextInput
                            label="Title"
                            value={Title}
                            type='outlined'
                            underlineColor={ThemeColors.CGREEN}
                            activeUnderlineColor={ThemeColors.CGREEN}
                            onChangeText={text => setTitle(text)}
                            style={STYLES.input}
                        />
                        <TouchableOpacity style={STYLES.editContentCont} onPress={() => navigation.navigate(NavigationStrings.EDITOR)} >
                            <Text style={STYLES.editContentText} >Edit Content</Text>
                            <TouchableOpacity onPress={() => navigation.navigate(NavigationStrings.EDITOR)} >
                                <Avatar.Icon size={35} color={ThemeColors.WHITE} icon={'pencil'} style={{ backgroundColor: ThemeColors.CGREEN, borderRadius: ms(10) }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        label="Author"
                        value={Author}
                        type='outlined'
                        underlineColor={ThemeColors.CGREEN}
                        activeUnderlineColor={ThemeColors.CGREEN}
                        onChangeText={text => setAuthor(text)}
                        style={STYLES.input}
                    />
                    <Button
                        mode="contained"
                        style={STYLES.btn}
                        onPress={params?.editAuthor ? () => publishHandler(true) : () => publishHandler(false)}
                    >
                        {params?.editAuthor ? 'Edit Blog' : 'Publish Blog'}
                    </Button>
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
    myUserId: Creators.userId,
    myContent: Creators.content,
    myallBlogs: Creators.allBlogs,
    myUserState: Creators.userState,
    myuserBlogs: Creators.userBlogs,
}

const mapStateToProps = (state) => {
    return {
        Content: state.UserAuth.content,
        allBlogs: state.UserAuth.allBlogs,
        userFromStore: state.UserAuth.user,
        userBlogs: state.UserAuth.userBlogs,
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userIdentification: state.UserAuth.userIdentification,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBlog)

const STYLES = StyleSheet.create({
    editContentCont: {
        paddingLeft: ms(16),
        paddingRight: ms(3),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: vs(10),
        borderTopLeftRadius: ms(5),
        borderTopRightRadius: ms(5),
        justifyContent: 'space-between',
        backgroundColor: ThemeColors.LIGHTGRAY,
        borderBottomColor: ThemeColors.CGREEN,
    },
    editContentText: {
        color: ThemeColors.BLACKOPACITY80
    },
    mainCont: {
        flex: 1,
        marginVertical: vs(5),
        marginHorizontal: ms(15),
    },
    mainContNL: {
        flex: 1,
        marginVertical: vs(5),
        justifyContent: 'center',
        marginHorizontal: ms(15),
    },
    htmlView: (theme) => ({
        borderTopEndRadius: 5,
        borderBottomWidth: 0.5,
        borderTopStartRadius: 5,

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
        backgroundColor: ThemeColors.LIGHTGRAY
    },
    imgCont: {
        alignItems: 'center',
        marginVertical: mvs(10),
        justifyContent: 'center',
    },
    btn: {
        marginVertical: vs(3),
        backgroundColor: ThemeColors.CGREEN
    },
    lottieCont: (width, height) => ({
        width: width,
        height: height / 4,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    iconCont: {
        zIndex: 1,
        bottom: 15,
        right: 20,
        padding: ms(10),
        borderRadius: 50,
        position: 'absolute',
        backgroundColor: ThemeColors.CGREEN,
    },
    editIcon: {
        backgroundColor: 'transparent',
    },
    editIconCont: {
        top: 2,
        right: 2,
        borderRadius: ms(10),
        position: 'absolute',
        backgroundColor: ThemeColors.CGREEN,
    },
    coverImgCont: {
        alignItems: 'center',
        borderRadius: ms(12),
        justifyContent: 'center',
        backgroundColor: ThemeColors.CGREEN,
    },
})
