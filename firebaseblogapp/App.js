import React from 'react'
import { Provider } from 'react-redux'
import ReduxStore from './SRC/Redux/Store/Store'
import { PersistGate } from 'redux-persist/integration/react'
import MainTabNavigation from './SRC/Navigation/TabNavigation/MainTabNavigation/MainTabNavigation'

const App = () => {
    const { Store, Persistor } = ReduxStore()
    return (
        <Provider store={Store}>
            <PersistGate persistor={Persistor} loading={null} >
                <MainTabNavigation />
            </PersistGate>
        </Provider>
    )
}

export default App
