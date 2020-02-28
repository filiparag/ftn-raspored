import React, { constructor } from 'react'
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import TimetableEntry from '../components/TimetableEntry'
import { List, Header } from 'semantic-ui-react'
import '../style/Timetable.css'
import { randomKey } from '../App'
import { fetchTimetable } from '../store/timetable/actions'

type TimetableProps = {}

export const Timetable: React.FC<TimetableProps> = () => {

  const timetable = useSelector(
    (state: ApplicationState) => state.timetable
  )

  const existingFilters = useSelector(
    (state: ApplicationState) => state.existingFilters
  )

  const loader = useSelector(
    (state: ApplicationState) => state.loader
  )

  const dispatch = useDispatch()

  // fetchTimetable(dispatch, existingFilters)
  
  const dayNames = [
    'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak',
    'Petak', 'Subota', 'Nedelja'
  ]

  const rows = []

  for (const day in timetable) {
    rows.push(<Header size='large' key={randomKey()}>{dayNames[day]}</Header>)
    for (const entry of timetable[day]) {
      rows.push(<TimetableEntry entry={entry} key={randomKey()} />)
    }
  }

  const NoEntriesMessage = (
    <Header size='medium'>Raspored je prazan</Header>
  )


  return (
    <List size='big' relaxed>
      {rows.length > 0 ? rows : NoEntriesMessage}
    </List>
  )
}

export default Timetable