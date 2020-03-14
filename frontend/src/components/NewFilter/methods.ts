import { Filter, NewFilter } from '../../store/filters/types'
import { dropdownObject, naturalSortEntries, abbrevateName } from './functions'
import { DropdownEntry, dayStrings, Section, UIState, DispatchUIPayload } from './data'
import { updateNewFilter } from '../../store/filters/actions'
import { typeName } from '../TimetableEntry'

export const ddDays = (): DropdownEntry[] => {
  const days = [] as DropdownEntry[]
  for (const day in dayStrings)
    days.push(dropdownObject(dayStrings[day], day))
  return days
}

const continueNesting = (
  current: Section,
  target: Section
): boolean => {

  const order: Section[] = [
    'da', '/', 'sp', 'sg', 'sm', 'su', 'ty',
    'gr', 'le', 'cl'
  ]

  const curIndex = order.indexOf(current)
  const tarIndex = order.indexOf(target)

  return curIndex >= tarIndex - 1

}

export const uiUpdate = (
  state: NewFilter,
  uiState: UIState,
  filters: Filter,
  section: Section,
  values?: any
) => {

  if (values === undefined)
    values = []

  const payloads: DispatchUIPayload[] = []
  const spPld: DispatchUIPayload = {
    section: 'sp',
    values: [] as Array<number>,
    string: ''
  }
  const sgPld: DispatchUIPayload = {
    section: 'sg',
    values: [] as Array<number>,
    string: ''
  }
  const smPld: DispatchUIPayload = {
    section: 'sm',
    values: [] as Array<number>,
    string: ''
  }
  const suPld: DispatchUIPayload = {
    section: 'su',
    values: [] as Array<number>,
    string: ''
  }
  const tyPld: DispatchUIPayload = {
    section: 'ty',
    values: [] as Array<number>,
    string: ''
  }
  const grPld: DispatchUIPayload = {
    section: 'gr',
    values: [] as Array<string>,
    string: ''
  }
  const lePld: DispatchUIPayload = {
    section: 'le',
    values: [] as Array<string>,
    string: ''
  }
  const clPld: DispatchUIPayload = {
    section: 'cl',
    values: [] as Array<string>,
    string: ''
  }
  const daPld: DispatchUIPayload = {
    section: 'da',
    values: [] as Array<number>,
    string: ''
  }
  const tsPld: DispatchUIPayload = {
    section: 'ts',
    values: [] as Array<number>,
    string: ''
  }
  const tePld: DispatchUIPayload = {
    section: 'te',
    values: [] as Array<number>,
    string: ''
  }
  const spArray = [] as DropdownEntry[]
  const sgArray = [] as DropdownEntry[]
  const smArray = [] as DropdownEntry[]
  const suArray = [] as DropdownEntry[]
  const tyArray = [] as DropdownEntry[]
  const grArray = [] as DropdownEntry[]
  const leArray = [] as DropdownEntry[]
  const clArray = [] as DropdownEntry[]

  if (continueNesting(section, 'sp')) {
    for (const sp of filters) {
      if (section === '/')
        spArray.push(dropdownObject(sp.name, sp.id))
      else if (section === 'sp' && values.includes(sp.id)) {
        spPld.values.push(sp.id)
        spPld.string += `${spPld.string.length === 0
          ? '' : ', '}${sp.name}`
      }
      if (
        continueNesting(section, 'sg') &&
        (state.studyPrograms.includes(sp.id) ||
        spPld.values.includes(sp.id))
      ) {
        for (const sg of sp.studyGroups) {
          if (section === 'sp')
            sgArray.push(dropdownObject(
              sg.name === 'SVI' ? sp.name : 
              `${sg.name} (${abbrevateName(sp.name)})`
            , sg.id))
          else if (section === 'sg' && values.includes(sg.id)) {
            sgPld.values.push(sg.id)
            sgPld.string += `${sgPld.string.length === 0
              ? '' : ', '}${sg.name === 'SVI'
              ? sp.name : sg.name + ' (' 
              + abbrevateName(sp.name) + ')'}`
          }
          if (
            continueNesting(section, 'sm') &&
            (state.studyGroups.includes(sg.id) ||
            sgPld.values.includes(sg.id))
          ) {
            for (const sm of sg.semesters) {
              if (section === 'sg')
                smArray.push(dropdownObject(
                  `${sm.name} semestar (${sg.name === 'SVI' ? 
                  abbrevateName(sp.name) : abbrevateName(sp.name)
                  + ' ' + abbrevateName(sg.name)})`
                , sm.id))
              else if (section === 'sm' && values.includes(sm.id)) {
                smPld.values.push(sm.id)
                smPld.string += `${smPld.string.length === 0
                  ? '' : ', '}${sm.name} semestar (${
                  sg.name === 'SVI'
                  ? abbrevateName(sp.name)
                  : abbrevateName(sp.name) + ' '
                  + abbrevateName(sg.name)})`
              }
              if (
                continueNesting(section, 'su') &&
                (state.semesters.includes(sm.id) ||
                smPld.values.includes(sm.id))
              ) {
                for (const su of sm.subjects) {
                  if (section === 'sm')
                    suArray.push(dropdownObject(
                      `${su.name} (${sg.name === 'SVI' ? 
                      abbrevateName(sp.name) : abbrevateName(sp.name)
                      + ' ' + abbrevateName(sg.name)})`
                    , su.id))
                  else if (section === 'su' && values.includes(su.id)) {
                    suPld.values.push(su.id)
                    suPld.string += `${suPld.string.length === 0
                      ? '' : ', '}${su.name} (${
                      sg.name === 'SVI'
                      ? abbrevateName(sp.name)
                      : abbrevateName(sp.name) + ' '
                      + abbrevateName(sg.name)})`
                  }
                  if (
                    section === 'sm' ||
                    state.subjects.includes(su.id) ||
                    suPld.values.includes(su.id) ||
                    suPld.values.length === 0
                  ) {
                    for (const ty of su.types) {
                      if (section !== 'ty') {
                        if (tyArray.filter(t => t.key === ty.id).length === 0)
                          tyArray.push(dropdownObject(
                            typeName(ty.name)
                          , ty.id))
                        } else if (section === 'ty' && values.includes(ty.id)) {
                        if (!tyPld.values.includes(ty.id)) {
                          tyPld.values.push(ty.id)
                          tyPld.string += `${tyPld.string.length === 0 ?
                                          '' : ', '}${typeName(ty.name)}`
                        }
                      }
                    }
                    for (const gr of su.groups) {
                      if (section !== 'gr') {
                        if (grArray.filter(t => t.key === gr).length === 0)
                          grArray.push(dropdownObject(gr, gr))
                        } else if (section === 'gr' && values.includes(gr)) {
                        if (!grPld.values.includes(gr)) {
                          grPld.values.push(gr)
                          grPld.string += `${grPld.string.length === 0 ?
                                          '' : ', '}${gr}`
                        }
                      }
                    }
                    for (const le of su.lecturers) {
                      if (section !== 'le') {
                        if (leArray.filter(t => t.key === le).length === 0)
                          leArray.push(dropdownObject(le, le))
                        } else if (section === 'le' && values.includes(le)) {
                        if (!lePld.values.includes(le)) {
                          lePld.values.push(le)
                          lePld.string += `${lePld.string.length === 0 ?
                                          '' : ', '}${le}`
                        }
                      }
                    }
                    for (const cl of su.classrooms) {
                      if (section !== 'cl') {
                        if (clArray.filter(t => t.key === cl).length === 0)
                          clArray.push(dropdownObject(cl, cl))
                        } else if (section === 'cl' && values.includes(cl)) {
                        if (!clPld.values.includes(cl)) {
                          clPld.values.push(cl)
                          clPld.string += `${clPld.string.length === 0 ?
                                          '' : ', '}${cl}`
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else if (section === 'da') {
    values.forEach((day: number) => {
      daPld.values.push(day)
      daPld.string += `${daPld.string.length === 0 ?
        '' : ', '}${dayStrings[
        uiState.get.days.findIndex(el => el.value === day)]}`
    })
  } else if (section === 'ts') {
    if (tsPld.values.length === 2 && tsPld.values[0] === 'set') {
      tsPld.string = 'set'
      tsPld.values = [tsPld.values[1]]
    } else
      tsPld.string = values.join('')
  } else if (section === 'te') {
    if (tePld.values.length === 2 && tePld.values[0] === 'set') {
      tePld.string = 'set'
      tePld.values = [tePld.values[1]]
    } else
      tePld.string = values.join('')
  }
  
  switch (section) {
    case '/': {
      uiState.set.spSet(naturalSortEntries(spArray))
      break
    }
    case 'sp': {
      uiState.set.sgSet(naturalSortEntries(sgArray))
      payloads.push(spPld)
      break
    }
    case 'sg': {
      uiState.set.smSet(naturalSortEntries(smArray))
      payloads.push(sgPld)
      break
    }
    case 'sm': {
      uiState.set.suSet(naturalSortEntries(suArray))
      uiState.set.tySet(naturalSortEntries(tyArray))
      uiState.set.grSet(naturalSortEntries(grArray))
      uiState.set.leSet(naturalSortEntries(leArray))
      uiState.set.clSet(naturalSortEntries(clArray))
      payloads.push(smPld)
      break
    }
    case 'su': {
      uiState.set.tySet(naturalSortEntries(tyArray))
      uiState.set.grSet(naturalSortEntries(grArray))
      uiState.set.leSet(naturalSortEntries(leArray))
      uiState.set.clSet(naturalSortEntries(clArray))
      payloads.push(suPld)
      break
    }
    case 'ty': {
      payloads.push(tyPld)
      break
    }
    case 'gr': {
      payloads.push(grPld)
      break
    }
    case 'le': {
      payloads.push(lePld)
      break
    }
    case 'cl': {
      payloads.push(clPld)
      break
    }
    case 'da': {
      payloads.push(daPld)
      break
    }
    case 'ts': {
      payloads.push(tsPld)
      break
    }
    case 'te': {
      payloads.push(tePld)
      break
    }
  }

  payloads.forEach((p: DispatchUIPayload) => {
    uiState.dispatch(updateNewFilter(section, p))
  })

}