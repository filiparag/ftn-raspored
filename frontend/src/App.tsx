import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Store } from 'redux'
import { ApplicationState, apiURL } from './store'
import ReactGA from 'react-ga';
import Menu from './components/Menu'
import Page from './components/Page'
import Loader from './components/Loader'
import Prompt from './components/Prompt'
import 'semantic-ui-css/semantic.min.css'
import './style/App.css';
import { showPrompt } from './store/prompt/actions'
import { decodeFilter, encodeFilter } from './components/ExistingFilter';
import { showNewSharedFilter } from './store/filters/actions';
import { PageName } from './store/menu/types';
import { viewPage } from './store/menu/actions';

interface AppProps {
  store: Store<ApplicationState>
}

interface URLParameter {
  key: string,
  value: string | null
}

export const randomKey = (): string => {
  return (Math.floor(Math.random() * 100000000)).toString()
}

const App: React.FC<AppProps> = ({ store }) => {

  const telemetry = store.getState().preferences.telemetry

  const existingFilters = store.getState().existingFilters

  const dispatch = useDispatch()

  fetch(`${apiURL()}version`)
    .then(response => response.text())
    .then(version => {
      if (
        localStorage.getItem('version') !== version &&
        existingFilters.length > 0
      ) {
        dispatch(showPrompt({
          header: 'Aplikacija je ažurirana',
          body: <>Postojeći filteri više neće raditi</>,
          size: 'tiny',
          actions: [{
            name: 'U redu',
            color: 'blue',
            icon: 'check',
            action: () => {
              localStorage.setItem('version', version)
              dispatch(viewPage(PageName.FILTERS))
              if (telemetry)
                ReactGA.event({
                  category: 'Filters',
                  action: 'Invalidate previous version'
                })
            }
          },]
        }))
      }
    })

  const pareseURL = (hash: string) => {
    const params = hash.split('#').filter(h => h.length > 0).map((p: string) => {
      const [key, ...value] = p.split("=")
      return {
        key: key,
        value: value.length === 0 ? null : value.join('=')
      } as URLParameter
    })
    window.location.hash = ''
    params.forEach(p => {
      switch (p.key) {
        case 'filter': {
          if (p.value !== null) {
            let existing = false
            for (const filter of existingFilters)
              if (encodeFilter(filter) === p.value)
                existing = true
            if (!existing) {
              const entry = decodeFilter(p.value)
              setTimeout(() => dispatch(showPrompt({
                header: 'Primljen je novi filter',
                body: null,
                size: 'tiny',
                actions: [
                  {
                    name: 'Odbaci',
                    color: 'red',
                    icon: 'trash alternate',
                    action: () => {
                      ReactGA.event({
                        category: 'Filters',
                        action: 'Reject shared filter'
                      })
                    }
                  },
                  {
                    name: 'Dodaj',
                    color: 'green',
                    icon: 'add',
                    action: () => {
                      ReactGA.event({
                        category: 'Filters',
                        action: 'Add shared filter'
                      })
                      dispatch(
                        viewPage(PageName.FILTERS)
                      )
                      dispatch(
                        showNewSharedFilter(entry)
                      )
                    }
                  }
                ]
              })), 1500)
            }
          }
          break
        }
      }
    })
  }

  useEffect(() => {
    if (telemetry)
      ReactGA.pageview("/")
    pareseURL(window.location.hash)
    // eslint-disable-next-line
  }, [telemetry])

  return (
    <>
      <Loader />
      <Prompt />
      <div className='Page'>
        <Page />
      </div>
      <div className='Menu'>
        <Menu />
      </div>
    </>
  )
}

export default App;
