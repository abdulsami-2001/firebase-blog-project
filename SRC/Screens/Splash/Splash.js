import React, { useRef, useEffect, useState } from 'react'
import Lottie from 'lottie-react-native';
import { s } from 'react-native-size-matters';
import { StyleSheet, TouchableOpacity, Text, View, useWindowDimensions, Animated } from 'react-native'

const Splash = ({ setShowSplash }) => {
    const { width, height } = useWindowDimensions('screen')
    const [BtnClicked, setBtnClicked] = useState(false)

    const animation = useRef(new Animated.Value(0)).current
    const startAnimation = () => {
        Animated.timing(animation, {
            duration: 500,
            toValue: BtnClicked ? 0 : 1,
            useNativeDriver: true,
        }).start()
    }
    const animation2 = useRef(new Animated.Value(0)).current
    const startAnimation2 = () => {
        Animated.timing(animation2, {
            duration: 500,
            toValue: BtnClicked ? 0 : 1,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        setTimeout(() => {
            startAnimation()
        }, 1000);
        setTimeout(() => {
            startAnimation2()
        }, 1500);
    }, [])


    return (
        <View style={STYLES.mainCont} >
            <Animated.View style={[
                STYLES.textCont,
                {
                    transform: [
                        {
                            translateY: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 100]
                            })
                        }
                    ]
                }
            ]}
            >
                <Text style={STYLES.textVD} >Developed 👨‍💻 at VentureDive ❤</Text>
            </Animated.View>
            {/* <TouchableOpacity onPress={() => {
                // setBtnClicked(!BtnClicked)
                startAnimation()
                startAnimation2()
            }} style={STYLES.lottieCont(width, height)} >
                <Lottie
                    source={require('../../Assets/Lottie/writing.json')}
                    style={STYLES.lottie(width, height)}
                    autoPlay
                    loop
                    speed={0.5}
                />
            </TouchableOpacity> */}

            <View
                style={STYLES.lottieCont(width, height)} >
                <Lottie
                    source={require('../../Assets/Lottie/writing.json')}
                    style={STYLES.lottie(width, height)}
                    autoPlay
                    loop
                    speed={0.5}
                />
            </View>
            <Animated.View style={[STYLES.textCont, {
                transform: [
                    {
                        translateY: animation2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -100]
                        })
                    }
                ]
            }]} >
                <Text style={STYLES.textMW} >Made with 💙 by</Text>
                <Text style={STYLES.textMS}>Muhammad Sami ✨</Text>
            </Animated.View>
        </View>
    )
}

export default Splash

const STYLES = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textCont: {
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink'
    },
    lottieCont: (width, height) => ({
        width: width,
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    lottie: (width, height) => ({
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    textVD: {
        fontSize: s(18),
        fontWeight: 'bold',
    },
    textMW: {
    },
    textMS: {
        fontSize: s(18),
        fontWeight: 'bold',
    }
})