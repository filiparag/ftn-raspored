import fetch from 'cross-fetch'
import { action } from 'typesafe-actions'
import { TimetableAction, TimetableList } from './types'
import { hideLoader } from '../loader/actions'

export const updateTimetable = (entries: TimetableList) => action(TimetableAction.UPDATE, entries)

export const fetchTimetable = (store: any) => {
  fetch(`http://localhost:10000/api/devel/casovi?semestar=22`)
    .then(response => response.json())
    .then(json => store.dispatch(updateTimetable(json))).finally(() => store.dispatch(hideLoader()))
}