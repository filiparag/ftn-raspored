import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Persistor } from 'redux-persist'
import { ApplicationState } from './store'
import ReactGA from 'react-ga';
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
  
  const telemetry = store.getState().preferences.telemetry

  useEffect(() => {
    if (telemetry) {
      ReactGA.initialize('UA-159492774-1')
      ReactGA.pageview("/")
    }
  }, [telemetry])

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
