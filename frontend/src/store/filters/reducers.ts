import { Reducer } from 'redux'
import { FilterAction, Filter, FilterStudyProgram, FilterStudyGroup, FilterSemester, FilterSubject, FilterChild, NewFilter, NewFilterAction } from './types'
import { initialState } from '..'

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
    default: {
      return state
    }
  }
}

export const newFilterReducer: Reducer<NewFilter> = (state: NewFilter = initialState.newFilter, action): NewFilter => {
  switch (action.type) {
    case NewFilterAction.SHOW: {
      return {
        ...state,
        visible: true
      }
    }
    case NewFilterAction.CLOSE: {
      return {
        ...initialState.newFilter,
        visible: false
      }
    }
    case NewFilterAction.UPDATE_RESET: {
      if (action.payload.group === undefined) {
        return {
          ...initialState.newFilter,
          visible: state.visible
        }
      }
      switch (action.payload.group) {
        case 'sp': {
          state.studyPrograms.splice(0, state.studyPrograms.length)
          break
        }
        case 'sg': {
          state.studyGroups.splice(0, state.studyGroups.length)
          break
        }
        case 'sm': {
          state.semesters.splice(0, state.semesters.length)
          break
        }
        case 'su': {
          state.subjects.splice(0, state.subjects.length)
          break
        }
        case 'gr': {
          state.groups.splice(0, state.groups.length)
          break
        }
        case 'ty': {
          state.types.splice(0, state.types.length)
          break
        }
        case 'ts': {
          state.timeStart = initialState.newFilter.timeStart
          break
        }
        case 'te': {
          state.timeEnd = initialState.newFilter.timeEnd
          break
        }
      }
      return state
    }
    case NewFilterAction.UPDATE_ADD: {
      switch (action.payload.group) {
        case 'sp': {
          if (Array.isArray(action.payload.value)) {
            state.studyPrograms.push(...action.payload.value)
          } else {
            state.studyPrograms.push(action.payload.value)
          }
          break
        }
        case 'sg': {
          if (Array.isArray(action.payload.value)) {
            state.studyGroups.push(...action.payload.value)
          } else {
            state.studyGroups.push(action.payload.value)
          }
          break
        }
        case 'sm': {
          if (Array.isArray(action.payload.value)) {
            state.semesters.push(...action.payload.value)
          } else {
            state.semesters.push(action.payload.value)
          }
          break
        }
        case 'su': {
          if (Array.isArray(action.payload.value)) {
            state.subjects.push(...action.payload.value)
          } else {
            state.subjects.push(action.payload.value)
          }
          break
        }
        case 'gr': {
          if (Array.isArray(action.payload.value)) {
            state.groups.push(...action.payload.value)
          } else {
            state.groups.push(action.payload.value)
          }
          break
        }
        case 'ty': {
          if (Array.isArray(action.payload.value)) {
            state.types.push(...action.payload.value)
          } else {
            state.types.push(action.payload.value)
          }
          break
        }
        case 'ts': {
          const delta = (action.payload.value === 'add') ? 0.5 : -0.5
          state.timeStart = ((state.timeStart + delta % 24) + 24) % 24
          break
        }
        case 'te': {
          const delta = (action.payload.value === 'add') ? 0.5 : -0.5
          state.timeEnd = ((state.timeEnd + delta % 24) + 24) % 24
          break
        }
      }
      return state
    }
    default: {
      return state
    }
  }
}