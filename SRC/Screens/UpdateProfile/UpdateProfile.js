import { connect } from 'react-redux'
import React, { useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob';
import Lottie from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { ms, vs } from 'react-native-size-matters'
import { Creators } from '../../Redux/Action/Action'
import storage from '@react-native-firebase/storage'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import DocumentPicker from 'react-native-document-picker'
import { ThemeColors } from '../../Utils/ThemeColors/ThemeColors'
import { StyleSheet, View, Dimensions, Image } from 'react-native'
import { Avatar, Card, Text, Button, TextInput } from 'react-native-paper'


const UpdateProfile = ({ isUserLoggedIn, userIdentification, userFromStore, myUser, usersData, myUsersData, }) => {
    const { width, height } = Dimensions.get('screen')
    const [NewName, setNewName] = useState('')

    // Image picker from cam/ gallery
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
                    type: "warning",
                    duration: 3000,
                })
            }
        }
    }

    // upload to firebase cloud storage
    const uploadToFBCloudStorage = async (fileName, base64String, fileType) => {
        // const user = userFromStore
        const user = userFromStore?._user || userFromStore
        showMessage({
            message: "Picture uploading in process",
            type: "info",
            duration: 3000
        })
        const uploadContent = storage().ref(`userProfilePictures/${userFromStore?.uid}_${fileName}`)
            .putString(base64String, 'base64', { contentType: fileType })
        uploadContent.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            showMessage({
                message: `Picture upload is ${progress} % done`,
                type: "info",
            })
            switch (snapshot.state) {
                case 'paused':
                    showMessage({
                        message: `Upload is paused`,
                        description: 'Make sure you have working internet',
                        type: "warning",
                        duration: 3000,
                    })
                    break;
                case 'running':
                    showMessage({
                        message: `Upload is running`,
                        type: "info",
                        duration: 3000,
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
                    duration: 3000,
                })
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadContent.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    auth()?.currentUser.updateProfile({
                        photoURL: downloadURL
                    }).then(() => {
                        // Profile update successful
                        // You can display a success message to the user if needed
                        myUser({ ...user, photoURL: downloadURL })
                        updateUsersData(false, downloadURL)
                        showMessage({
                            message: "Picture Uploaded Successfully",
                            type: "success",
                            duration: 3000,
                        })
                    }).catch(error => {
                        // Handle profile update error
                        showMessage({
                            message: "Picture Uploaded Unsuccessfully",
                            type: "warning",
                            duration: 3000,
                        })
                    });
                });
            }
        )
    }

    // UI input handler , and restriction on any empty value
    const nameUpdateHandler = () => {
        if (NewName != '') {
            updateName()
        } else if (NewName == '') {
            showMessage({
                message: "New Name Not Be Empty",
                type: "warning",
                duration: 3000,
            });
        } else {
            showMessage({
                message: "Some Unexpected Error",
                type: "warning",
                duration: 3000,
            });
        }
    }

    // updating name on firebase and redux
    const updateName = async () => {
        const user = userFromStore?._user || userFromStore
        // const user = userFromStore
        showMessage({
            message: "Updating Name",
            type: "info",
            duration: 3000
        })
        if (NewName != '') {
            auth()?.currentUser.updateProfile({
                displayName: NewName
            }).then(() => {
                myUser({ ...user, displayName: NewName })
                updateUsersData(NewName, false)
                setNewName('')
                showMessage({
                    message: "Name Update Successfully",
                    duration: 3000,
                    type: "success",
                })
            }).catch(error => {
                // Handle profile update error
                showMessage({
                    message: "Name Update Unsuccessfully",
                    type: "warning",
                    duration: 3000,
                })
            });
        }

    }

    // updateUsersData to firebase and redux, it is used for displaying info on comments and posts author img.
    const updateUsersData = async (displayName, photoURL) => {
        try {
            const userRef = firestore().collection('UsersData').doc(userIdentification);

            // Update only if the displayName or photoURL is provided
            if (displayName) {
                await userRef.set({
                    displayName: displayName,
                    photoURL: usersData[userIdentification]?.photoURL || '',
                }, { merge: true })
                myUsersData({
                    ...usersData, // previous all users data
                    [userIdentification]: { // new data of userIdentification
                        displayName: displayName,
                        photoURL: usersData[userIdentification]?.photoURL || '',
                    },
                })
            }
            if (photoURL) {
                await userRef.set({
                    photoURL: photoURL,
                    displayName: usersData[userIdentification]?.displayName || '',
                }, { merge: true })
                myUsersData({
                    ...usersData, // previous all users data
                    [userIdentification]: { // new data of userIdentification
                        photoURL: photoURL,
                        displayName: usersData[userIdentification]?.displayName || '',
                    },
                })
            }


            console.log('User data updated successfully!');
        } catch (error) {
            console.log('Error updating user data:', error);
        }
    };


    if (isUserLoggedIn) {
        return (
            <>
                <View style={STYLES.upperCont}>
                    <Card style={STYLES.card(width, height)}>
                        {userFromStore?.photoURL != null ? <Image source={{ uri: userFromStore?.photoURL }} width={100} style={STYLES.profilePicture} /> : <Avatar.Icon size={100} color={ThemeColors.WHITE} style={STYLES.profileAvatar} icon={'account-circle'} />}
                        <Text style={{ ...STYLES.textBold, paddingLeft: 0, alignSelf: 'center' }} >{userFromStore?.displayName}</Text>
                        <Button
                            icon="camera"
                            mode="contained"
                            onPress={() => imageUploadHandler()}
                            style={STYLES.picBtn}
                        >
                            Update Picture
                        </Button>
                    </Card>
                </View>
                <View style={STYLES.midCont}>
                    <TextInput
                        label="New Name"
                        value={NewName}
                        type='outlined'
                        style={STYLES.input}
                        keyboardType='email-address'
                        underlineColor={ThemeColors.CGREEN}
                        onChangeText={text => setNewName(text)}
                        activeUnderlineColor={ThemeColors.CGREEN}
                    />
                    <Button
                        mode="contained"
                        onPress={() => nameUpdateHandler()}
                        style={STYLES.picBtn}
                    >
                        Update Name
                    </Button>
                </View>
            </>
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
    myallBlogs: Creators.allBlogs,
    myUser: Creators.user,
    myUsersData: Creators.usersData,
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: state.UserAuth.isUserLoggedIn,
        userBlogs: state.UserAuth.userBlogs,
        userIdentification: state.UserAuth.userIdentification,
        allBlogs: state.UserAuth.allBlogs,
        userFromStore: state.UserAuth.user,
        usersData: state.UserAuth.usersData,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile)

const STYLES = StyleSheet.create({
    input: {
        marginVertical: vs(8),
        backgroundColor: ThemeColors.LIGHTGRAY,
    },
    picBtn: {
        backgroundColor: ThemeColors.CGREEN,
        marginTop: vs(5)
    },
    upperCont: {
        flex: 2,
        backgroundColor: ThemeColors.CGREEN,
        alignItems: 'center',
        paddingHorizontal: ms(15),
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
    },
    midCont: {
        paddingHorizontal: ms(15),
        flex: 3,
        // marginTop: vs(20),
    },
    textNormal: {
        paddingLeft: ms(10),
        fontSize: ms(11),
        alignSelf: 'center',
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: ms(14),
        paddingLeft: ms(10),
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: ms(50),
        alignSelf: 'center',
    },
    profileAvatar: {
        backgroundColor: ThemeColors.CGREEN,
        alignSelf: 'center',
    },
    editIcon: {
        backgroundColor: 'transparent',
        alignSelf: 'flex-end'
    },
    card: (width, height) => ({
        width: width / 1.3,
        height: height / 3.5,
        borderRadius: ms(20),
        justifyContent: 'center',
        alignItems: 'center',
    }),
    mainContNL: {
        flex: 1,
        marginHorizontal: ms(15),
        marginVertical: vs(5),
        justifyContent: 'center',
        alignItems: 'center',
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
    headingCont: {
        marginVertical: vs(20),
        alignItems: 'center',
    },
    heading: {
        fontSize: 22,
        alignSelf: 'center',
        color: ThemeColors.GRAY,
    },
})