import { action } from 'typesafe-actions'
import { PageName, PageAction } from './types'

export const viewPage = (page: PageName) => action(PageAction.CHANGE, page)