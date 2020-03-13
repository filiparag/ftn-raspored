import { createStore, combineReducers, applyMiddleware, compose, Store, StoreEnhancer } from 'redux';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer, Persistor, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import menuReducer from './menu/reducers'
import timetableReducer from './timetable/reducers'
import loaderReducer from './loader/reducers'
import promptReducer from './prompt/reducers'
import preferencesReducer from './preferences/reducers'
import { filterReducer, newFilterReducer, existingFiltersReducer } from './filters/reducers'
import { MenuState, PageName } from './menu/types';
import { PromptState } from './prompt/types';
import { PreferencesState } from './preferences/types';
import { Filter, NewFilter, FilterEntry } from './filters/types';
import { TimetableList } from './timetable/types';
import { fetchFilters } from './filters/actions';

export interface ApplicationState {
  menu: MenuState,
  timetable: TimetableList,
  loader: number,
  prompt: PromptState,
  filter: Filter,
  newFilter: NewFilter,
  existingFilters: FilterEntry[],
  preferences: PreferencesState
}

export const initialState: ApplicationState = {
  menu: {
    page: PageName.FILTERS
  },
  timetable: [] as TimetableList,
  loader: 0,
  prompt: null,
  filter: [] as Filter,
  newFilter: {
    studyPrograms: [] as Array<number>,
    studyGroups: [] as Array<number>,
    semesters: [] as Array<number>,
    subjects: [] as Array<number>,
    groups: [] as Array<string>,
    types: [] as Array<number>,
    lecturers: [] as Array<string>,
    classrooms: [] as Array<string>,
    days: [] as Array<number>,
    timeStart: 0.0,
    timeEnd: 23.5,
    spString: '',
    sgString: '',
    smString: '',
    suString: '',
    grString: '',
    tyString: '',
    leString: '',
    clString: '',
    daString: '',
    tsString: '',
    teString: '',
    visible: false
  } as NewFilter,
  existingFilters: [] as FilterEntry[],
  preferences: {
    telemetry: true,
  }
}

export const apiURL = () => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      return 'http://localhost:10000/'
    }
    case 'production': {
      return '/api/'
    }
    default: {
      return '/api/'
    }
  }
}

export function configureStore(initialState: ApplicationState): {store: Store<ApplicationState>, persistor: Persistor} {

  const rootReducer = combineReducers({
    menu: menuReducer,
    timetable: timetableReducer,
    loader: loaderReducer,
    prompt: promptReducer,
    filter: filterReducer,
    newFilter: newFilterReducer,
    existingFilters: existingFiltersReducer,
    preferences: preferencesReducer
  })

  const persistConfig: PersistConfig<ApplicationState, any, any, any> = {
    key: 'root',
    storage,
    whitelist: ['timetable', 'existingFilters', 'preferences'],
    stateReconciler: autoMergeLevel2
  }

  const persistedReducer = persistReducer<ApplicationState>(persistConfig, rootReducer)

  const middlewareEnhancer = applyMiddleware(
    thunkMiddleware
  )

  let enchancers: StoreEnhancer<{dispatch: unknown;}, {}>;
  
  switch (process.env.NODE_ENV) {
    case 'development': {
      enchancers = compose(
        middlewareEnhancer,
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
      )
      break
    }
    case 'production': {
      enchancers = middlewareEnhancer
      break
    }
    default: {
      enchancers = middlewareEnhancer
      break
    }
  }
  
  const store = createStore(
    persistedReducer,
    enchancers
  )

  const persistor = persistStore(store)

  fetchFilters(store.dispatch)

  return { store, persistor }

}
