import { createStore, combineReducers, applyMiddleware, compose, Store } from 'redux';
import thunkMiddleware from 'redux-thunk'
import menuReducer from './menu/reducers'
import timetableReducer from './timetable/reducers'
import loaderReducer from './loader/reducers'
import { filterReducer, newFilterReducer, existingFiltersReducer } from './filters/reducers'
import { MenuState, PageName } from './menu/types';
import { Filter, NewFilter, FilterEntry } from './filters/types';
import { TimetableList } from './timetable/types';
import { fetchTimetable } from './timetable/actions'
import { fetchFilters } from './filters/actions'

export interface ApplicationState {
  menu: MenuState,
  timetable: TimetableList
  loader: number
  filter: Filter
  newFilter: NewFilter
  existingFilters: FilterEntry[]
}

export const initialState: ApplicationState = {
  menu: {
    page: PageName.FILTERS
  },
  timetable: [] as TimetableList,
  loader: 0,
  filter: [] as Filter,
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
  },
  existingFilters: [] as FilterEntry[]
}

export function configureStore(initialState?: ApplicationState): Store<ApplicationState> {

  const rootReducer = combineReducers({
    menu: menuReducer,
    timetable: timetableReducer,
    loader: loaderReducer,
    filter: filterReducer,
    newFilter: newFilterReducer,
    existingFilters: existingFiltersReducer
  })

  const middlewareEnhancer = applyMiddleware(
    thunkMiddleware
  )

  const enchancers = compose(
    middlewareEnhancer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
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