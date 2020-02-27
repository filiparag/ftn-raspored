import { Reducer } from 'redux'
import { FilterAction, Filter, FilterStudyProgram, FilterStudyGroup, FilterSemester, FilterSubject, FilterChild } from './types'
import { initialState } from '..'
import { types } from 'util'

export const filterReducer: Reducer<Filter> = (state: Filter = initialState.filter, action): Filter => {
  switch (action.type) {
    case FilterAction.UPDATE: {        
      const filters: Filter = []
      for (const sp of action.payload) {
        const studyProgram = {
          id: sp['studijski_program']['id'],
          name: sp['studijski_program']['studijski_program'],
          studyGroups: []
        } as FilterStudyProgram
        for (const sg of sp['studijska_grupa']) {
          const studyGroup = {
            id: sg['studijska_grupa']['id'],
            name: sg['studijska_grupa']['studijska_grupa'],
            semesters: []
          } as FilterStudyGroup
          for (const sm of sg['semestar']) {
            const semester = {
              id: sm['semestar']['id'],
              name: sm['semestar']['semestar'],
              subjects: []
            } as FilterSemester
            for (const su of sm['predmet']) {
              const subject = {
                id: su['predmet']['id'],
                name: su['predmet']['predmet'],
                groups: su['grupa'],
                types: []
              } as FilterSubject
              for (const ty of su['vrsta_nastave']) {
                const type = {
                  id: ty['id'],
                  name: ty['vrsta_nastave']
                } as FilterChild
                subject.types.push(type)
              }
              semester.subjects.push(subject)
            }
            studyGroup.semesters.push(semester)
          }
          studyProgram.studyGroups.push(studyGroup)
        }
        filters.push(studyProgram)
      }
      return filters
    }
    // case FilterAction.ADD: {
    //   return {
    //     ...state,
    //   }
    // }
    default: {
      return state
    }
  }
}

export default filterReducer