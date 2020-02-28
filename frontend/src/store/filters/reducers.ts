import { Reducer } from 'redux'
import { FilterAction, Filter, FilterStudyProgram, FilterStudyGroup, FilterSemester, FilterSubject, FilterChild, NewFilter, NewFilterAction, FilterEntry } from './types'
import { initialState } from '..'
import { timeString } from '../../components/TimetableEntry'

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
    case NewFilterAction.ADD: {
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
          state.spString = ''
          state.studyPrograms.splice(0, state.studyPrograms.length)
          break
        }
        case 'sg': {
          state.sgString = ''
          state.studyGroups.splice(0, state.studyGroups.length)
          break
        }
        case 'sm': {
          state.smString = ''
          state.semesters.splice(0, state.semesters.length)
          break
        }
        case 'su': {
          state.suString = ''
          state.subjects.splice(0, state.subjects.length)
          break
        }
        case 'gr': {
          state.grString = ''
          state.groups.splice(0, state.groups.length)
          break
        }
        case 'ty': {
          state.tyString = ''
          state.types.splice(0, state.types.length)
          break
        }
        case 'ts': {
          state.tsString = ''
          state.timeStart = initialState.newFilter.timeStart
          break
        }
        case 'te': {
          state.teString = ''
          state.timeEnd = initialState.newFilter.timeEnd
          break
        }
      }
      return state
    }
    case NewFilterAction.UPDATE_ADD: {
      switch (action.payload.group) {
        case 'sp': {
          if (Array.isArray(action.payload.value.id)) {
            state.studyPrograms.push(...action.payload.value.id)
          } else {
            state.studyPrograms.push(action.payload.value.id)
          }
          state.spString += action.payload.value.string
          break
        }
        case 'sg': {
          if (Array.isArray(action.payload.value.id)) {
            state.studyGroups.push(...action.payload.value.id)
          } else {
            state.studyGroups.push(action.payload.value.id)
          }
          state.sgString += action.payload.value.string
          break
        }
        case 'sm': {
          if (Array.isArray(action.payload.value.id)) {
            state.semesters.push(...action.payload.value.id)
          } else {
            state.semesters.push(action.payload.value.id)
          }
          state.smString += action.payload.value.string
          break
        }
        case 'su': {
          if (Array.isArray(action.payload.value.id)) {
            state.subjects.push(...action.payload.value.id)
          } else {
            state.subjects.push(action.payload.value.id)
          }
          state.suString += action.payload.value.string
          break
        }
        case 'gr': {
          if (Array.isArray(action.payload.value.id)) {
            state.groups.push(...action.payload.value.id)
          } else {
            state.groups.push(action.payload.value.id)
          }
          state.grString += action.payload.value.string
          break
        }
        case 'ty': {
          if (Array.isArray(action.payload.value.id)) {
            state.types.push(...action.payload.value.id)
          } else {
            state.types.push(action.payload.value.id)
          }
          state.tyString += action.payload.value.string
          break
        }
        case 'ts': {
          const delta = (action.payload.value === 'add') ? 0.5 : -0.5
          state.timeStart = ((state.timeStart + delta % 24) + 24) % 24
          state.tsString = timeString(state.timeStart)
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

export const existingFiltersReducer: Reducer<FilterEntry[]> = (state: FilterEntry[] = initialState.existingFilters, action): FilterEntry[] => {
  switch (action.type) {
    case NewFilterAction.ADD: {
      state.push(action.payload)
      return state
    }
    case FilterAction.REMOVE: {
      state.splice(action.payload)
      return state
    }
    default: {
      return state
    }
  }
}