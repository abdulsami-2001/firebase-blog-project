import React from 'react'
import { Provider } from 'react-redux'
import ReduxStore from './SRC/Redux/Store/Store'
import { PersistGate } from 'redux-persist/integration/react'
import MainTabNavigation from './SRC/Navigation/TabNavigation/MainTabNavigation/MainTabNavigation'
import { PaperProvider } from 'react-native-paper';

const App = () => {
    const { Store, Persistor } = ReduxStore()
    return (
        <Provider store={Store}>
            <PersistGate persistor={Persistor} loading={null} >
                <PaperProvider>
                    <MainTabNavigation />
                </PaperProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
