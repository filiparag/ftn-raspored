import React from 'react'
import ReactGA from 'react-ga';
import { Segment, Header, Grid, Icon, Popup } from 'semantic-ui-react'
import { FilterEntry } from '../store/filters/types'
import { useDispatch, useSelector } from 'react-redux'
import { removeExistingFilter, updateEditExistingFilter } from '../store/filters/actions'
import '../style/Filter.css'
import { ApplicationState, apiURL, initialState } from '../store'
import { showPrompt } from '../store/prompt/actions'
import { cleanTimetable } from '../store/timetable/actions'
import QRCode from 'qrcode.react'

export interface ExistingFilterProps {
  id: number,
  entry: FilterEntry
}

export const encodeFilter = (f: FilterEntry): string => {
  const str = JSON.stringify(Object.values(f).slice(0, 11))
  const enc = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(("0x" + p1) as any);
  }))
  if (enc !== undefined)
    return enc
  else
    return ''
}

export const encodeQuery = (filter: FilterEntry): string => {
  const query = [] as string[]
  filter.studyPrograms.forEach(val => {
    query.push(`studijskiProgram=${val}`)
  })
  filter.studyGroups.forEach(val => {
    query.push(`studijskaGrupa=${val}`)
  })
  filter.semesters.forEach(val => {
    query.push(`semestar=${val}`)
  })
  filter.subjects.forEach(val => {
    query.push(`predmet=${val}`)
  })
  filter.groups.forEach(val => {
    query.push(`grupa=${val}`)
  })
  filter.types.forEach(val => {
    query.push(`vrstaNastave=${val}`)
  })
  filter.lecturers.forEach(val => {
    query.push(`izvodjac=${val}`)
  })
  filter.days.forEach(val => {
    query.push(`dan=${val}`)
  })
  query.push(`vremeOdPosle=${filter.timeStart}`)
  query.push(`vremeDoPre=${filter.timeEnd}`)
  return query.join('&');
}

export const decodeFilter = (str: string): FilterEntry => {
  const dstr = decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(""))
  const arr = JSON.parse(dstr)
  return {
    studyPrograms: arr[0],
    studyGroups: arr[1],
    semesters: arr[2],
    subjects: arr[3],
    groups: arr[4],
    types: arr[5],
    lecturers: arr[6],
    classrooms: arr[7],
    days: arr[8],
    timeStart: arr[9],
    timeEnd: arr[10]
  } as FilterEntry
}

const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

const ExistingFilter: React.FC<ExistingFilterProps> = ({id, entry}) => {

  const dispatch = useDispatch()

  const telemetry = useSelector(
    (state: ApplicationState) => state.preferences.telemetry
  )

  const filters_length = useSelector(
    (state: ApplicationState) => state.filter.length
  )

  const shareURL = `${window.location.origin}/#filter=${encodeFilter(entry)}`

  return (
    <Segment color='grey' padded raised>
      <Grid columns={2}>
        <Grid.Column>
          <Header size='large'>Filter #{id + 1}</Header>
        </Grid.Column>
        <Grid.Column textAlign='right'>
          {filters_length > 0 ?
          <Popup content='Izmeni filter' inverted position='bottom left' trigger={
            <Icon
              className='ExistingFilterAction'
              bordered
              inverted
              color='blue'
              name='pencil'
              onClick={() => {
                dispatch(updateEditExistingFilter(id, entry))
              }}
            />
          } />
          : null}
          <Popup content='Podeli filter' inverted position='bottom center' trigger={
            <Icon
              className='ExistingFilterAction'
              bordered
              inverted
              color='teal'
              name='share alternate'
              onClick={() => dispatch(showPrompt({
                header: `Podeli filter`,
                body: (
                  <div style={{textAlign: 'center'}}>
                    <QRCode
                      renderAs='svg'
                      size={256}
                      includeMargin={false}
                      level='M'
                      value={shareURL}
                    />
                  </div>
                ),
                size: 'small',
                actions: [
                  {
                    name: 'Nazad',
                    action: null
                  },
                  {
                    name: 'Kopiraj link',
                    color: 'blue',
                    icon: 'copy outline',
                    action: () => copyToClipboard(
                      shareURL
                    ),
                    autohide: false
                  }
                ]
              }))}
            />
          } />
          <Popup content='Kopiraj link za iCal kalendar' inverted position='bottom right' trigger={
            <Icon
              className='ExistingFilterAction'
              bordered
              inverted
              color='teal'
              name='calendar alternate'
              onClick={() => {
                const url = `${window.location.protocol}//${
                  window.location.host
                }${apiURL()}ical?${encodeQuery(entry)}`;
                copyToClipboard(url);
              }}
            />
          } />
          <Popup content='Obriši filter' inverted position='bottom right' trigger={
            <Icon
              className='ExistingFilterAction'
              bordered
              inverted
              color='red'
              name='trash alternate'
              onClick={() => dispatch(showPrompt({
                header: `Obriši filter ${id + 1}?`,
                body: null,
                size: 'mini',
                actions: [
                  {
                    name: 'Nazad',
                    action: null
                  },
                  {
                    name: 'Obriši',
                    color: 'red',
                    icon: 'trash alternate',
                    action: () => {
                      if (telemetry)
                        ReactGA.event({
                          category: 'Filters',
                          action: 'Remove existing filter'
                        })
                      dispatch(removeExistingFilter(id))
                      dispatch(cleanTimetable())
                    }
                  }
                ]
              }))}
            />
          } />
        </Grid.Column>
      </Grid>
      {entry.spString.length > 0 ?
        <section>
          <Header size='medium'>Studijski program</Header>
          <p>
            {entry.spString}
          </p>
        </section>
      : null}
      {entry.sgString.length > 0 ?
          <section>
          <Header size='medium'>Studijska grupa</Header>
          <p>
            {entry.sgString}
          </p>
        </section>
      : null}
      {entry.smString.length > 0 ?
          <section>
          <Header size='medium'>Semestar</Header>
          <p>
            {entry.smString}
          </p>
        </section>
      : null}
      {entry.suString.length > 0 ?
          <section>
          <Header size='medium'>Predmet</Header>
          <p>
            {entry.suString}
          </p>
        </section>
      : null}
      {entry.tyString.length > 0 ?
        <section>
          <Header size='medium'>Vrsta nastave</Header>
          <p>
            {entry.tyString}
          </p>
        </section>
      : null}
      {entry.grString.length > 0 ?
      <section>
        <Header size='medium'>Grupa</Header>
        <p>
          {entry.grString}
        </p>
      </section>
      : null}
      {entry.leString.length > 0 ?
        <section>
          <Header size='medium'>Izvođač nastave</Header>
          <p>
            {entry.leString}
          </p>
        </section>
      : null}
      {entry.clString.length > 0 ?
        <section>
          <Header size='medium'>Učionica</Header>
          <p>
            {entry.clString}
          </p>
        </section>
      : null}
      {entry.daString.length > 0 ?
          <section>
          <Header size='medium'>Dan</Header>
          <p>
            {entry.daString}
          </p>
        </section>
      : null}
      {(entry.tsString.length > 0 || entry.teString.length > 0) &&
       (entry.timeStart !== initialState.newFilter.timeStart ||
        entry.timeEnd !== initialState.newFilter.timeEnd) ?
          <section>
          <Header size='medium'>Vreme</Header>
          <p>
            od {entry.tsString} do {entry.teString}
          </p>
        </section>
      : null}
    </Segment>
  )
}

export default ExistingFilter
