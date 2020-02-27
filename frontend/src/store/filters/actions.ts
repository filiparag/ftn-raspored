import { action } from 'typesafe-actions'
import { FilterAction, Filter } from './types'
import { Dispatch } from 'redux'

export const updateFilters = (filters: Filter) => action(FilterAction.UPDATE, filters)

export const addFilter = () => action(FilterAction.ADD)

export const fetchFilters = (dispatch: Dispatch) => {
  fetch(`http://localhost:10000/api/devel/filter/tree`)
    .then(response => response.json())
    .then(json => dispatch(updateFilters(json))) //.finally(() => dispatch())
}