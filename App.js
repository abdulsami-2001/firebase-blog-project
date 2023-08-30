import React from 'react'
import { Provider } from 'react-redux'
import { View, StatusBar } from 'react-native'
import ReduxStore from './SRC/Redux/Store/Store'
import { PaperProvider } from 'react-native-paper';
import FlashMessage from "react-native-flash-message";
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeColors } from './SRC/Utils/ThemeColors/ThemeColors'
import MainTabNavigation from './SRC/Navigation/TabNavigation/MainTabNavigation'
import LoginDemo from './SRC/Screens/Login/LoginDemo';
import Test from './SRC/Components/Test';


const App = () => {
    const { Store, Persistor } = ReduxStore()
    return (
        <Provider store={Store}>
            <PersistGate persistor={Persistor} loading={null} >
                <PaperProvider>
                    <StatusBar backgroundColor={ThemeColors.CGREEN} />
                    <View style={{ flex: 1 }} >
                        <MainTabNavigation />
                        {/* <LoginDemo /> */}
                        {/* <Test /> */}
                        <FlashMessage position="center" />
                    </View>
                </PaperProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
