import { Reducer } from 'redux'
import { PageAction, MenuState } from './types'
import { initialState } from '..'

export const menuReducer: Reducer<MenuState> = (state: MenuState = initialState.menu, action): MenuState => {
  switch (action.type) {
    case PageAction.CHANGE: {
      return {
        ...state,
        page: action.payload
      }
    }
    default: {
      return state
    }
  }
}

export default menuReducer