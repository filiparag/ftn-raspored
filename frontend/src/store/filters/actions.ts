import { action } from 'typesafe-actions'
import { FilterAction, Filter } from './types'
import { Dispatch } from 'redux'
import { showLoader, hideLoader } from '../loader/actions'

export const updateFilters = (filters: Filter) => action(FilterAction.UPDATE, filters)

export const showNewFilter = () => action(FilterAction.NEW_SHOW)

export const closeNewFilter = () => action(FilterAction.NEW_CLOSE)

export const updateNewFilter = (group: string, value: any) => action(FilterAction.NEW_UPDATE)

export const addNewFilter = () => action(FilterAction.NEW_ADD)

export const fetchFilters = (dispatch: Dispatch) => {
  dispatch(showLoader())
  fetch(`http://localhost:10000/api/devel/filter/tree`)
    .then(response => response.json())
    .then(json => dispatch(updateFilters(json))).finally(() => dispatch(hideLoader()))
}