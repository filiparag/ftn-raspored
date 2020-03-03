import React, { useEffect, createRef } from 'react'
import ReactGA from 'react-ga';
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import TimetableEntry from '../components/TimetableEntry'
import { List, Header, Message, Button } from 'semantic-ui-react'
import '../style/Timetable.css'
import { randomKey } from '../App'
import { viewPage } from '../store/menu/actions'
import { PageName } from '../store/menu/types'
import { showNewFilter } from '../store/filters/actions'
import { fetchTimetable } from '../store/timetable/actions'

type TimetableProps = {}

export const dayNames = [
  'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak',
  'Petak', 'Subota', 'Nedelja'
]

export const monthNames = [
  'januar', 'februar', 'mart', 'april', 'maj',
  'jun', 'jul', 'avgust', 'septembar', 'oktobar',
  'novembar', 'decembar'
]

export const Timetable: React.FC<TimetableProps> = () => {

  const timetable = useSelector(
    (state: ApplicationState) => state.timetable
  )

  const existingFilters = useSelector(
    (state: ApplicationState) => state.existingFilters
  )

  const telemetry = useSelector(
    (state: ApplicationState) => state.preferences.telemetry
  )

  const dispatch = useDispatch()

  const todayRef = createRef<HTMLDivElement>()
  const scrollToRef = (ref: React.RefObject<any>) => {
    if (ref.current !== null)
      window.scrollTo(0, ref.current.offsetTop)
  }

  useEffect(() => {
    if (telemetry)
      ReactGA.pageview("/timetable")
    fetchTimetable(dispatch, existingFilters)
    scrollToRef(todayRef)
  }, [existingFilters, dispatch, telemetry])

  const rows = []
  const now = new Date()
  const today = now.getDay() === 0 ? 6 : now.getDay() - 1
  const timeNow = now.getHours() + now.getMinutes() / 60

  for (const day in timetable) {
    if (timetable[day] !== null && timetable[day] !== undefined) {
      if (timetable[day].weekday === today)
        rows.push(
          <div ref={todayRef} key={randomKey()}></div>
        )
      rows.push(
        <Header size='large' key={randomKey()}>
          {timetable[day].date}
        </Header>
      )
      for (const entry of timetable[day].entries) {
        
        rows.push(
          <TimetableEntry
            entry={entry}
            key={randomKey()}
            ongoing={
              timetable[day].weekday === today &&
              entry.timeStart <= timeNow && entry.timeEnd >= timeNow
            }
          />
        )
      }
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

  if (rows.length === 0 && existingFilters.length === 0)
    return NoEntriesMessage
  else
    return (
    <List size='big' relaxed>
      {rows}
    </List>
  )
}

export default Timetable