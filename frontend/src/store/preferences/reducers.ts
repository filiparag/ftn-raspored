import { Reducer } from 'redux'
import { PreferencesAction, PreferencesState } from './types'
import { initialState } from '..'

export const preferencesReducer: Reducer<PreferencesState> = (state: PreferencesState = initialState.preferences, action): PreferencesState => {
  switch (action.type) {
    case PreferencesAction.TELEMETRY: {
      return {
        ...state,
        telemetry: action.payload
      }
    }
    default: {
      return state
    }
  }
}

export default preferencesReducer