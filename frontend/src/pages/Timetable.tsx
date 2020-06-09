import React, { useEffect, createRef, useLayoutEffect } from 'react'
import ReactGA from 'react-ga';
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import TimetableEntry from '../components/TimetableEntry'
import { List, Header, Message, Button } from 'semantic-ui-react'
import '../style/Timetable.css'
import { randomKey } from '../App'
import { viewPage } from '../store/menu/actions'
import { PageName } from '../store/menu/types'
import { showNewFilter, fetchFilters } from '../store/filters/actions'
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

  const filters_length = useSelector(
    (state: ApplicationState) => state.filter.length
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
    if (filters_length === 0)
      fetchFilters(dispatch)
    // eslint-disable-next-line
  }, [existingFilters, dispatch, telemetry])

  useLayoutEffect(() => {
    scrollToRef(todayRef)
  }, [todayRef])

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
      { filters_length > 0 ?
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
      : null}
    </Message>
  )

  const ErrorMessage = (
    <Message error>
      <Message.Header>
        Došlo je do greške
      </Message.Header>
      <p>
        Nemoguće je uspostaviti vezu sa serverom.
      </p>
      <Button
        fluid
        basic
        color='brown'
        onClick={() => {
          fetchTimetable(dispatch, existingFilters)
        }}
      >
        Pokušaj ponovo
      </Button>
    </Message>
  )

  if (rows.length === 0 && existingFilters.length === 0)
    return NoEntriesMessage
  else if (rows.length > 0)
    return (
      <List size='big' relaxed>
        {rows}
      </List>
    )
  else
    return ErrorMessage
}

export default Timetable