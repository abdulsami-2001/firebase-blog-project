import React from 'react'
import { ThemeColors } from '../Utils/ThemeColors/ThemeColors'
import Icon from 'react-native-vector-icons/Ionicons'
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import NavigationStrings from '../Utils/NavigationStrings/NavigationStrings'
import { useDeviceOrientation } from '@react-native-community/hooks'
import { ms, mvs, s } from 'react-native-size-matters'

const CustomHeader = ({ props }) => {
    const { height } = Dimensions.get('screen')
    const portrait = useDeviceOrientation()
    const { options, navigation } = props


    return (
        <View style={STYLES.mainCont(height, portrait)} >
            <View style={STYLES.wrapper1} >
                <View style={STYLES.textCont} >
                    <Text style={STYLES.title} >
                        {options && options.title}
                    </Text>
                </View>
            </View>

        </View>
    )
}

export default CustomHeader

const STYLES = StyleSheet.create({
    title: {
        fontFamily: 'GothamBold',
        color: ThemeColors.WHITE,
        fontSize: s(14),
        marginHorizontal: ms(5),
    },
    backbtn: {
        width: ms(50),
        height: ms(50),
    },
    mainCont: (height, portrait) => ({
        backgroundColor: ThemeColors.CGREEN,
        height: portrait == 'portrait' ? mvs(height / 15) : mvs(height / 8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(15)
    }),
    wrapper1: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    subTitle: {
        fontFamily: 'GothamLight',
        color: ThemeColors.WHITE,
        fontSize: s(10),
        paddingLeft: ms(6)
    }
})