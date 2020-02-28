import React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Persistor } from 'redux-persist'
import { ApplicationState } from './store'
import Menu from './components/Menu'
import Page from './components/Page'
import Loader from './components/Loader'
import 'semantic-ui-css/semantic.min.css'
import './style/App.css';

interface AppProps {
  store: Store<ApplicationState>,
  persistor: Persistor
}

export const randomKey = (): string => {
  return (Math.floor(Math.random() * 100000000)).toString()
}

const App: React.FC<AppProps> = ({ store, persistor }) => {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Loader />
        <div className='Page'>
          <Page />
        </div>
        <div className='Menu'>
          <Menu />
        </div>
      </PersistGate>
    </Provider>
  )
}

export default App;
