import { action } from 'typesafe-actions'
import { LoaderAction } from './types'

export const showLoader = () => action(LoaderAction.SHOW)

export const hideLoader = () => action(LoaderAction.HIDE)