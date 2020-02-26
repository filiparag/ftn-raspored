import { createStore, combineReducers, applyMiddleware, compose, Store } from 'redux';
import thunkMiddleware from 'redux-thunk'
import menuReducer from './menu/reducers'
import timetableReducer from './timetable/reducers'
import loaderReducer from './loader/reducers'
import { MenuState, PageName } from './menu/types';
import { TimetableList } from './timetable/types';
import { fetchTimetable } from './timetable/actions'

export interface ApplicationState {
  menu: MenuState,
  timetable: TimetableList
  loader: boolean
}

export const initialState: ApplicationState = {
  menu: {
    page: PageName.TIMETABLE
  },
  timetable: [],
  loader: true
}

export function configureStore(initialState?: ApplicationState): Store<ApplicationState> {

  const rootReducer = combineReducers({
    menu: menuReducer,
    timetable: timetableReducer,
    loader: loaderReducer
  })

  const middlewareEnhancer = applyMiddleware(
    thunkMiddleware
  )

  const enchancers = compose(
    middlewareEnhancer,
    // (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  )

  const store = createStore(
    rootReducer,
    initialState,
    enchancers
  )

  fetchTimetable(store)

  return store

}