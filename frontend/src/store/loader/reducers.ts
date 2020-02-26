import { Reducer } from 'redux'
import { LoaderAction } from './types'
import { initialState } from '..'

export const loaderReducer: Reducer<boolean> = (state: boolean = initialState.loader, action): boolean => {
  switch (action.type) {
    case LoaderAction.SHOW: {
      return true
    }
    case LoaderAction.HIDE: {
      return false
    }
    default: {
      return state
    }
  }
}

export default loaderReducer