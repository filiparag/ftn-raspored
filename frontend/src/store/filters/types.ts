export enum FilterAction {
  UPDATE = 'FILTER_UPDATE',
  REMOVE = 'FILER_REMOVE_EXISTING',
  EDIT   = 'FILTER_EDIT_EXISTING',
}

export interface FilterChild {
  id: number
  name: string
}

export interface FilterSubject extends FilterChild {
  types: FilterChild[], 
  groups: string[],
  lecturers: string[],
  classrooms: string[]
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

export interface FilterEntry {
  studyPrograms: Array<number>,
  studyGroups: Array<number>,
  semesters: Array<number>,
  subjects: Array<number>,
  groups: Array<string>,
  types: Array<number>,
  lecturers: Array<string>,
  classrooms: Array<string>,
  days: Array<number>
  timeStart: number,
  timeEnd: number,
  spString: string,
  sgString: string,
  smString: string,
  suString: string,
  grString: string,
  tyString: string,
  leString: string,
  clString: String,
  daString: string,
  tsString: string,
  teString: string
}

export interface NewFilter extends FilterEntry {
  fromExisting: boolean,
  visible: boolean
}

export enum NewFilterAction {
  SHOW = 'FILTER_NEW_SHOW',
  CLOSE = 'FILTER_NEW_CLOSE',
  ADD = 'FILTER_NEW_ADD',
  UPDATE_ADD = 'FILTER_NEW_UPDATE_ADD',
  UPDATE_RESET = 'FILTER_NEW_UPDATE_RESET'
}