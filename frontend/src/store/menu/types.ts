export enum PageName {
  TIMETABLE = 'TIMETABLE',
  FILTERS = 'FILTERS',
  PREFERENCES = 'PREFERENCES',
}

export enum PageAction {
  CHANGE = 'PAGE_CHANGE'
}

export interface MenuState {
  page: PageName
}