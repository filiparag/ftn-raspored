import React from 'react'
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import TimetableEntry from '../components/TimetableEntry'
import { List, Header, Message, Button } from 'semantic-ui-react'
import '../style/Timetable.css'
import { randomKey } from '../App'
import { viewPage } from '../store/menu/actions'
import { PageName } from '../store/menu/types'
import { showNewFilter } from '../store/filters/actions'

type TimetableProps = {}

export const Timetable: React.FC<TimetableProps> = () => {

  const timetable = useSelector(
    (state: ApplicationState) => state.timetable
  )
  const dispatch = useDispatch()

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
    <Message warning>
      <Message.Header>
        Raspored je prazan
      </Message.Header>
      <p>
        Kako bi se u rasporedu prikazivali časovi, potrebno je dodati
        barem jedan filter.
      </p>
      <Button
        fluid
        basic
        color='brown'
        onClick={() => {
          dispatch(viewPage(PageName.FILTERS))
          dispatch(showNewFilter())}
        }
      >
        Dodaj filter
      </Button>
    </Message>
  )

  if (rows.length === 0)
    return NoEntriesMessage
  else
    return (
    <List size='big' relaxed>
      {rows}
    </List>
  )
}

export default Timetable