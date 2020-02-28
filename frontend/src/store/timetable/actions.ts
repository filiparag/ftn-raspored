import fetch from 'cross-fetch'
import { action } from 'typesafe-actions'
import { TimetableAction, TimetableList } from './types'
import { hideLoader, showLoader } from '../loader/actions'
import { Dispatch } from 'react'
import { FilterEntry } from '../filters/types'

export const updateTimetable = (entries: TimetableList) => action(TimetableAction.UPDATE, entries)

export const fetchTimetable = async (dispatch: Dispatch<any>, filters: FilterEntry[]) => {

  dispatch(showLoader())

  if (filters.length === 0) {
    updateTimetable([])
    dispatch(hideLoader())
    return
  }
  
  var query = [] as string[]
  filters.forEach(filter => {
    filter.studyPrograms.forEach(val => {
      query.push(`studijskiProgram=${val}`)
    })
    filter.studyGroups.forEach(val => {
      query.push(`studijskaGrupa=${val}`)
    })
    filter.semesters.forEach(val => {
      query.push(`semestar=${val}`)
    })
    filter.subjects.forEach(val => {
      query.push(`predmet=${val}`)
    })
    filter.groups.forEach(val => {
      query.push(`grupa=${val}`)
    })
    filter.types.forEach(val => {
      query.push(`vrstaNastave=${val}`)
    })
    filter.days.forEach(val => {
      query.push(`dan=${val}`)
    })
    query.push(`vremeOdPosle=${filter.timeStart}`)
    query.push(`vremeDoPre=${filter.timeEnd}`)
  })

  const response = await fetch(`http://localhost:10000/api/devel/casovi?${query.join('&')}`)
  const json = await response.json()
  dispatch(updateTimetable(json))
  dispatch(hideLoader())

}