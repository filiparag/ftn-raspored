export enum FilterAction {
  FETCH = 'FILTER_FETCH',
  UPDATE = 'FILTER_UPDATE',
  ADD = 'FILTER_ADD'
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