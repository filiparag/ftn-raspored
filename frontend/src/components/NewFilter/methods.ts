import { Filter } from '../../store/filters/types'
import { dropdownObject, naturalSortEntries } from './functions'
import { DropdownEntry, dayStrings } from './data'

export const ddStudyPrograms = (f: Filter): DropdownEntry[] => {
  const spArray = [] as DropdownEntry[]
  for (const sp of f)
    spArray.push(dropdownObject(sp.name, sp.id))
  return naturalSortEntries(spArray)
}

export const ddDays = (): DropdownEntry[] => {
  const days = [] as DropdownEntry[]
  for (const day in dayStrings)
    days.push(dropdownObject(dayStrings[day], day))
  return days
}