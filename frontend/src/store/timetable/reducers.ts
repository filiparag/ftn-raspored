import { Reducer } from 'redux'
import { initialState } from '..'
import { TimetableList, TimetableAction, TimetableEntry } from './types'

export const timetableReducer: Reducer<TimetableList> = (state: TimetableList = initialState.timetable, action): TimetableList => {
  switch (action.type) {
    case TimetableAction.UPDATE: {

      var timetable: TimetableList = new Array(7);

      const search = (array: TimetableEntry[], entry: TimetableEntry): number => {
        if(array[0].timeStart > entry.timeStart) {
          return 0;
        }
        var i=1;
        while (
          i<array.length &&
          !(array[i].timeStart > entry.timeStart && 
          array[i-1].timeStart <= entry.timeStart)
        ) {
          i = i + 1;
        }
        return i;
      }

      for (const c in action.payload) {
      
        const entry: TimetableEntry = {
          id: action.payload[c]['id'],
          subject: action.payload[c]['predmet'],
          type: action.payload[c]['vrsta_nastave'],
          group: action.payload[c]['grupa'],
          timeStart: action.payload[c]['vreme_od'],
          timeEnd: action.payload[c]['vreme_do'],
          classroom: action.payload[c]['ucionica'],
          lecturer: action.payload[c]['izvodjac']
        }

        const day = action.payload[c]['dan']
        
        if (timetable[day] === undefined) {
          timetable[day] = [entry]
        } else {
          timetable[day].splice(
            search(timetable[day], entry),
            0,
            entry
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