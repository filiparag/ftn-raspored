import { action } from 'typesafe-actions'
import { FilterAction, Filter, NewFilterAction, FilterEntry } from './types'
import { Dispatch } from 'redux'
import { apiURL } from '..'
import { Section, DispatchUIPayload } from '../../components/NewFilter/data'

export const updateFilters = (filters: Filter) => action(FilterAction.UPDATE, filters)

export const removeExistingFilter = (id: number) => action(FilterAction.REMOVE, id)

export const updateEditExistingFilter = (id: number, filter: FilterEntry) => action(FilterAction.EDIT, {id: id, filter: filter})

export const updateSaveExistingFilter = (id: number, filter: FilterEntry) => action(FilterAction.SAVE, {id: id, filter: filter})

export const showNewFilter = () => action(NewFilterAction.SHOW)

export const showNewSharedFilter = (filter: FilterEntry) => action(NewFilterAction.ADD_SHARED, filter)

export const closeNewFilter = () => action(NewFilterAction.CLOSE)

export const updateResetNewFilter = (group?: string, value?: any) => action(NewFilterAction.UPDATE_RESET, {group: group})

export const updateAddNewFilter = (group?: string, value?: any) => action(NewFilterAction.UPDATE_ADD, {group: group, value: value})

export const updateNewFilter = (section: Section, p: DispatchUIPayload) => action(NewFilterAction.UPDATE, {section, p})

export const addNewFilter = (filter: FilterEntry) => action(NewFilterAction.ADD, filter)

export const fetchFilters = (dispatch: Dispatch) => {
  // dispatch(showLoader())
  fetch(`${apiURL()}filter/tree`)
    .then(response => response.json())
    .then(json => dispatch(updateFilters(json))) //.finally(() => dispatch(hideLoader()))
}