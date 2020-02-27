import { createStore, combineReducers, applyMiddleware, compose, Store } from 'redux';
import thunkMiddleware from 'redux-thunk'
import menuReducer from './menu/reducers'
import timetableReducer from './timetable/reducers'
import loaderReducer from './loader/reducers'
import { filterReducer, newFilterReducer } from './filters/reducers'
import { MenuState, PageName } from './menu/types';
import { Filter, NewFilter } from './filters/types';
import { TimetableList } from './timetable/types';
import { fetchTimetable } from './timetable/actions'
import { fetchFilters } from './filters/actions'

export interface ApplicationState {
  menu: MenuState,
  timetable: TimetableList
  loader: number
  filter: Filter
  newFilter: NewFilter
}

export const initialState: ApplicationState = {
  menu: {
    page: PageName.FILTERS
  },
  timetable: [],
  loader: 0,
  filter: [],
  newFilter: {
    studyPrograms: [] as Array<number>,
    studyGroups: [] as Array<number>,
    semesters: [] as Array<number>,
    subjects: [] as Array<number>,
    groups: [] as Array<string>,
    types: [] as Array<number>,
    timeStart: 0.0,
    timeEnd: 23.5,
    visible: false
  }
}

export function configureStore(initialState?: ApplicationState): Store<ApplicationState> {

  const rootReducer = combineReducers({
    menu: menuReducer,
    timetable: timetableReducer,
    loader: loaderReducer,
    filter: filterReducer,
    newFilter: newFilterReducer
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

  fetchTimetable(store.dispatch)
  fetchFilters(store.dispatch)

  return store

}