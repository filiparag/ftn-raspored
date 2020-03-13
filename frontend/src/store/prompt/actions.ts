import { action } from 'typesafe-actions'
import { PromptAction, PromptObject } from './types'

export const showPrompt = (state: PromptObject) => action(PromptAction.SHOW, state)

export const hidePrompt = () => action(PromptAction.HIDE)