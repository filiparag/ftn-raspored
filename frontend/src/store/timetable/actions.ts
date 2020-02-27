import fetch from 'cross-fetch'
import { action } from 'typesafe-actions'
import { TimetableAction, TimetableList } from './types'
import { hideLoader, showLoader } from '../loader/actions'
import { Dispatch } from 'react'

export const updateTimetable = (entries: TimetableList) => action(TimetableAction.UPDATE, entries)

export const fetchTimetable = (dispatch: Dispatch<any>) => {
  dispatch(showLoader())
  fetch(`http://localhost:10000/api/devel/casovi?semestar=549345731136785969&grupa=SVI&grupa=8`)
    .then(response => response.json())
    .then(json => dispatch(updateTimetable(json))).finally(() => dispatch(hideLoader()))
}