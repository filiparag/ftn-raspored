import { Reducer } from 'redux'
import { LoaderAction } from './types'
import { initialState } from '..'

export const loaderReducer: Reducer<number> = (state: number = initialState.loader, action): number => {
  switch (action.type) {
    case LoaderAction.SHOW: {
      return state + 1
    }
    case LoaderAction.HIDE: {
      return Math.max(state - 1, 0)
    }
    default: {
      return state
    }
  }
}

export default loaderReducer