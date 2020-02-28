import React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { ApplicationState } from './store'
import Menu from './components/Menu'
import Page from './components/Page'
import Loader from './components/Loader'
import 'semantic-ui-css/semantic.min.css'
import './style/App.css';

interface AppProps {
  store: Store<ApplicationState>
}

export const randomKey = (): string => {
  return (Math.floor(Math.random() * 100000000)).toString()
}

const App: React.FC<AppProps> = ({ store }) => {
  return (
    <Provider store={store}>
      <Loader />
      <div className='Page'>
        <Page />
      </div>
      <div className='Menu'>
        <Menu />
      </div>
    </Provider>
  )
}

export default App;
