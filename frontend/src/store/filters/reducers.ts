import { Reducer } from 'redux'
import { FilterAction, Filter, FilterStudyProgram, FilterStudyGroup, FilterSemester, FilterSubject, FilterChild, NewFilter, NewFilterAction, FilterEntry } from './types'
import { initialState } from '..'
import { timeString } from '../../components/TimetableEntry'
import { PageAction } from '../menu/types'

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
                types: [],
                lecturers: su['izvodjac'],
                classrooms: su['ucionica']
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
    case PageAction.CHANGE: {
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
          return {
            ...state,
            spString: '',
            studyPrograms: []
          }
        }
        case 'sg': {
          return {
            ...state,
            sgString: '',
            studyGroups: []
          }
        }
        case 'sm': {
          return {
            ...state,
            smString: '',
            semesters: []
          }
        }
        case 'su': {
          return {
            ...state,
            suString: '',
            subjects: []
          }
        }
        case 'gr': {
          return {
            ...state,
            grString: '',
            groups: []
          }
        }
        case 'ty': {
          return {
            ...state,
            tyString: '',
            types: []
          }
        }
        case 'le': {
          return {
            ...state,
            leString: '',
            lecturers: []
          }
        }
        case 'cl': {
          return {
            ...state,
            clString: '',
            classrooms: []
          }
        }
        case 'da': {
          return {
            ...state,
            daString: '',
            days: []
          }
        }
        case 'ts': {
          return {
            ...state,
            tsString: '',
            timeStart: initialState.newFilter.timeStart
          }
        }
        case 'te': {
          return {
            ...state,
            teString: '',
            timeEnd: initialState.newFilter.timeEnd
          }
        }
        default: {
          return state
        }
      }
    }
    case NewFilterAction.UPDATE_ADD: {
      var ids = [] as Array<number>
      if (!['gr', 'ts', 'te'].includes(action.payload.group))
        if (Array.isArray(action.payload.value.id))
          ids = action.payload.value.id
        else
          ids = [action.payload.value.id]
      switch (action.payload.group) {
        case 'sp': {
          return {
            ...state,
            studyPrograms: [...state.studyPrograms, ...ids],
            spString: state.spString + action.payload.value.string
          }
        }
        case 'sg': {
          return {
            ...state,
            studyGroups: [...state.studyGroups, ...ids],
            sgString: state.sgString + action.payload.value.string
          }
        }
        case 'sm': {
          return {
            ...state,
            semesters: [...state.semesters, ...ids],
            smString: state.smString + action.payload.value.string
          }
        }
        case 'su': {
          return {
            ...state,
            subjects: [...state.subjects, ...ids],
            suString: state.suString + action.payload.value.string
          }
        }
        case 'gr': {
          var groups = [] as Array<string>
          if (Array.isArray(action.payload.value.id))
            groups = action.payload.value.id
          else
            groups = [action.payload.value.id]
          return {
            ...state,
            groups: [...state.groups, ...groups],
            grString: state.grString + action.payload.value.string
          }
        }
        case 'ty': {
          return {
            ...state,
            types: [...state.types, ...ids],
            tyString: state.tyString + action.payload.value.string
          }
        }
        case 'le': {
          var lecturers = [] as Array<string>
          if (Array.isArray(action.payload.value.id))
            lecturers = action.payload.value.id
          else
            lecturers = [action.payload.value.id]
          return {
            ...state,
            lecturers: [...state.lecturers, ...lecturers],
            leString: state.leString + action.payload.value.string
          }
        }
        case 'cl': {
          var classrooms = [] as Array<string>
          if (Array.isArray(action.payload.value.id))
            classrooms = action.payload.value.id
          else
            classrooms = [action.payload.value.id]
          return {
            ...state,
            classrooms: [...state.classrooms, ...classrooms],
            clString: state.clString + action.payload.value.string
          }
        }
        case 'da': {
          return {
            ...state,
            days: [...state.days, ...ids],
            daString: state.daString + action.payload.value.string
          }
        }
        case 'ts': {
          const delta = (action.payload.value === 'add') ? 0.5 : 
                        (action.payload.value === 'sub') ? -0.5 : 0
          const time = ((state.timeStart + delta % 24) + 24) % 24
          return {
            ...state,
            timeStart: time,
            tsString: timeString(time)
          }
        }
        case 'te': {
          const delta = (action.payload.value === 'add') ? 0.5 : 
                        (action.payload.value === 'sub') ? -0.5 : 0
          const time = ((state.timeEnd + delta % 24) + 24) % 24
          return {
            ...state,
            timeEnd: time,
            teString: timeString(time)
          }
        }
        default: {
          return state
        }
      }
    }
    default: {
      return state
    }
  }
}

export const existingFiltersReducer: Reducer<FilterEntry[]> = (state: FilterEntry[] = initialState.existingFilters, action): FilterEntry[] => {
  switch (action.type) {
    case NewFilterAction.ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case FilterAction.REMOVE: {
      state.splice(action.payload, 1)
      return [...state]
    }
    default: {
      return state
    }
  }
}