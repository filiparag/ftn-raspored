import { Reducer } from 'redux'
import { initialState } from '..'
import { TimetableList, TimetableAction, TimetableEntry, TimetableDay } from './types'
import { dayNames, monthNames } from '../../pages/Timetable'

export const timetableReducer: Reducer<TimetableList> = (state: TimetableList = initialState.timetable, action): TimetableList => {
  switch (action.type) {
    case TimetableAction.UPDATE: {

      let timetable: TimetableList = new Array(7)

      const search = (array: TimetableEntry[], entry: TimetableEntry): number => {
        if(array[0].timeStart > entry.timeStart) {
          return 0;
        }
        let i=1;
        while (
          i<array.length &&
          !(array[i].timeStart > entry.timeStart && 
          array[i-1].timeStart <= entry.timeStart)
        ) {
          i = i + 1;
        }
        return i;
      }

      const insert = (
        day: TimetableDay,
        entry: TimetableEntry,
        weekday: number | null,
        date: string | null
      ): TimetableDay => {
        if (day === undefined)
          day = {
            weekday: weekday,
            date: date,
            entries: [entry]
          }
        else
          day.entries.splice(
            search(day.entries, entry),
            0,
            entry
          )
        return day
      }

      for (const c of action.payload) {
      
        const entry: TimetableEntry = {
          id: c['id'],
          subject: c['predmet'],
          type: c['vrsta_nastave'],
          group: c['grupa'],
          timeStart: c['vreme_od'],
          timeEnd: c['vreme_do'],
          classroom: c['ucionica'],
          lecturer: c['izvodjac']
        }

        if (c['dan'] > 6) {
          const today = new Date()
          const classDate = new Date(0)
          classDate.setUTCSeconds(c['dan']);
          const dayDiff = Math.ceil((classDate.getTime() - today.getTime()) / 1000 / 86400)
          const dayOfWeek = classDate.getDay() === 0 ? 6 : classDate.getDay() - 1
          const dateString = `${dayNames[dayOfWeek]}, ` +
                              `${classDate.getDate()}. ` +
                              `${monthNames[classDate.getMonth() + 1]} ` +
                              `${classDate.getFullYear()}.`
          if (dayDiff < 0)
            continue
          else {
            if (dayDiff < 7)
              timetable[dayOfWeek] = insert(
                timetable[dayOfWeek], entry, dayOfWeek, dayNames[dayOfWeek]
              )
            else {
              timetable[6 + dayDiff] = insert(
                timetable[dayDiff], entry, null, dateString
              )
            }
            
          }
        } else {
          timetable[c['dan']] = insert(
            timetable[c['dan']], entry, c['dan'], dayNames[c['dan']]
          )
        }

      }

      return timetable
      
    }
    default: {
      return state
    }
  }
}

export default timetableReducer