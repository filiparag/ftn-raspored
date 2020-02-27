import { action } from 'typesafe-actions'
import { FilterAction, Filter, NewFilterAction } from './types'
import { Dispatch } from 'redux'
import { showLoader, hideLoader } from '../loader/actions'

export const updateFilters = (filters: Filter) => action(FilterAction.UPDATE, filters)

export const showNewFilter = () => action(NewFilterAction.SHOW)

export const closeNewFilter = () => action(NewFilterAction.CLOSE)

export const updateResetNewFilter = (group?: string, value?: any) => action(NewFilterAction.UPDATE_RESET, {group: group})

export const updateAddNewFilter = (group?: string, value?: any) => action(NewFilterAction.UPDATE_ADD, {group: group, value: value})

export const addNewFilter = () => action(NewFilterAction.ADD)

export const fetchFilters = (dispatch: Dispatch) => {
  dispatch(showLoader())
  fetch(`http://localhost:10000/api/devel/filter/tree`)
    .then(response => response.json())
    .then(json => dispatch(updateFilters(json))).finally(() => dispatch(hideLoader()))
}