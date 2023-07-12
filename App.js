import React from 'react'
import { Provider } from 'react-redux'
import ReduxStore from './SRC/Redux/Store/Store'
import { PersistGate } from 'redux-persist/integration/react'
import MainTabNavigation from './SRC/Navigation/TabNavigation/MainTabNavigation'
import { PaperProvider } from 'react-native-paper';
import FlashMessage from "react-native-flash-message";
import { View } from 'react-native'

const App = () => {
    const { Store, Persistor } = ReduxStore()
    return (
        <Provider store={Store}>
            <PersistGate persistor={Persistor} loading={null} >
                <PaperProvider>
                    <View style={{ flex: 1 }} >
                        <MainTabNavigation />
                        <FlashMessage position="bottom" />
                    </View>
                </PaperProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
