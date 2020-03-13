import { Reducer } from 'redux'
import { PromptState, PromptAction } from './types'
import { initialState } from '..'

export const promptReducer: Reducer<PromptState> = (state: PromptState = initialState.prompt, action): PromptState => {
  switch (action.type) {
    case PromptAction.SHOW: {
      return action.payload
    }
    case PromptAction.HIDE: {
      return null
    }
    default: {
      return state
    }
  }
}

export default promptReducer