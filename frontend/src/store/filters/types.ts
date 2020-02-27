export enum FilterAction {
  UPDATE = 'FILTER_UPDATE',
  NEW_SHOW = 'FILTER_NEW_SHOW',
  NEW_CLOSE = 'FILTER_NEW_CLOSE',
  NEW_ADD = 'FILTER_NEW_ADD',
  NEW_UPDATE = 'FILTER_NEW_UPDATE',
}

export interface FilterChild {
  id: number
  name: string
}

export interface FilterSubject extends FilterChild {
  types: FilterChild[] 
  groups: string[]
}

export interface FilterSemester extends FilterChild {
  subjects: FilterSubject[]
}

export interface FilterStudyGroup extends FilterChild{
  semesters: FilterSemester[]
}

export interface FilterStudyProgram extends FilterChild{
  studyGroups: FilterStudyGroup[]
}

export type Filter = FilterStudyProgram[]