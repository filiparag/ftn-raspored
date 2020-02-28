import { createStore, combineReducers, applyMiddleware, compose, Store } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer, Persistor, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import menuReducer from './menu/reducers'
import timetableReducer from './timetable/reducers'
import loaderReducer from './loader/reducers'
import { filterReducer, newFilterReducer, existingFiltersReducer } from './filters/reducers'
import { MenuState, PageName } from './menu/types';
import { Filter, NewFilter, FilterEntry } from './filters/types';
import { TimetableList } from './timetable/types';

export interface ApplicationState {
  menu: MenuState,
  timetable: TimetableList
  loader: number
  filter: Filter
  newFilter: NewFilter
  existingFilters: FilterEntry[],
}

export const initialState: ApplicationState = {
  menu: {
    page: PageName.TIMETABLE
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
    days: [] as Array<number>,
    types: [] as Array<number>,
    timeStart: 0.0,
    timeEnd: 23.5,
    spString: '',
    sgString: '',
    smString: '',
    suString: '',
    grString: '',
    tyString: '',
    daString: '',
    tsString: '',
    teString: '',
    visible: false
  },
  existingFilters: [] as FilterEntry[],
}

export function configureStore(initialState: ApplicationState): {store: Store<ApplicationState>, persistor: Persistor} {

  const rootReducer = combineReducers({
    menu: menuReducer,
    timetable: timetableReducer,
    loader: loaderReducer,
    filter: filterReducer,
    newFilter: newFilterReducer,
    existingFilters: existingFiltersReducer
  })

  const persistConfig: PersistConfig<ApplicationState, any, any, any> = {
    key: 'root',
    storage,
    whitelist: ['existingFilters']
  }

  const persistedReducer = persistReducer<ApplicationState>(persistConfig, rootReducer)

  const middlewareEnhancer = applyMiddleware(
    thunkMiddleware
  )

  const enchancers = compose(
    middlewareEnhancer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  )

  const store = createStore(
    persistedReducer,
    enchancers
  )

  const persistor = persistStore(store)

  return { store, persistor }

}