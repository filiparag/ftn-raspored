export interface TimetableEntry {
  id: number,
  subject: string,
  type: string,
  group: string,
  timeStart: number,
  timeEnd: number,
  classroom: string,
  lecturer: string
}

export type TimetableList = TimetableEntry[][]

export enum TimetableAction {
  ADD_DAY = 'TIMETABLE_ADD_DAY',
  REMOVE_DAY = 'TIMETABLE_REMOVE_DAY',
  ADD_CLASS = 'TIMETABLE_ADD_CLASS',
  REMOVE_CLASS = 'TIMETABLE_REMOVE_CLASS',
  UPDATE = 'TIMETABLE_UPDATE'
}