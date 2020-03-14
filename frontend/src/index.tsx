import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ReactGA from 'react-ga';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configureStore, initialState } from './store'
import './style/index.css';

const { store, persistor } = configureStore(initialState)

ReactGA.initialize('UA-159492774-1')

render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App store={store} />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();