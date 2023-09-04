import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { View, StatusBar } from 'react-native'
import Splash from './SRC/Screens/Splash/Splash';
import ReduxStore from './SRC/Redux/Store/Store'
import { PaperProvider } from 'react-native-paper';
import FlashMessage from "react-native-flash-message";
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeColors } from './SRC/Utils/ThemeColors/ThemeColors'
import MainTabNavigation from './SRC/Navigation/TabNavigation/MainTabNavigation'

const App = () => {
    const { Store, Persistor } = ReduxStore()
    const [ShowSplash, setShowSplash] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false)
        }, 3500);
    }, [])


    return (
        <Provider store={Store}>
            <PersistGate persistor={Persistor} loading={null} >
                <PaperProvider>
                    <StatusBar backgroundColor={ThemeColors.CGREEN} />
                    <View style={{ flex: 1 }} >
                        {ShowSplash ?
                            <Splash setShowSplash={setShowSplash} /> : null}
                        {ShowSplash ? null : <MainTabNavigation />}
                        <FlashMessage position="center" />
                    </View>
                </PaperProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
