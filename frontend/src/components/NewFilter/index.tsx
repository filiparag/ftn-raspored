import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga';
import { ApplicationState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { Header, Dropdown, Divider, Button, Segment, Grid, Label } from 'semantic-ui-react'
import { timeString } from '../TimetableEntry'
import { closeNewFilter, addNewFilter, updateSaveExistingFilter } from '../../store/filters/actions'
import { DropdownEntry, UIState } from './data'
import { ddDays, uiUpdate } from './methods';

type NewFilterProps = {}

export const NewFilter: React.FC<NewFilterProps> = () => {

  const newFilter = useSelector(
    (state: ApplicationState) => state.newFilter
  )
  
  const filters = useSelector(
    (state: ApplicationState) => state.filter
  )
  
  const telemetry = useSelector(
    (state: ApplicationState) => state.preferences.telemetry
  )
  
	const dispatch = useDispatch()
	
	const fromExisting = newFilter.existingID !== undefined

  const [studyPrograms, spSet] = useState([] as DropdownEntry[])
  const [studyGroups, sgSet] = useState([] as DropdownEntry[])
  const [semesters, smSet] = useState([] as DropdownEntry[])
  const [subjects, suSet] = useState([] as DropdownEntry[])
  const [groups, grSet] = useState([] as DropdownEntry[])
  const [types, tySet] = useState([] as DropdownEntry[])
  const [lecturers, leSet] = useState([] as DropdownEntry[])
  const [classrooms, clSet] = useState([] as DropdownEntry[])
  const [days, daSet] = useState(ddDays())
  
  const uiState: UIState = {
    get: {
      studyPrograms, studyGroups, semesters, subjects, groups, types, lecturers, classrooms, days
    },
    set: {
      spSet, sgSet, smSet, suSet, grSet, tySet, leSet, clSet, daSet
    },
    dispatch
  }

  useEffect(() => {
    if (telemetry)
      ReactGA.pageview("/filters/new")
    uiUpdate(newFilter, uiState, filters, '/')
		if (fromExisting || newFilter.shared) {
      uiUpdate(newFilter, uiState, filters, 'sp', newFilter.studyPrograms)
      uiUpdate(newFilter, uiState, filters, 'sg', newFilter.studyGroups)
			uiUpdate(newFilter, uiState, filters, 'sm', newFilter.semesters)
			uiUpdate(newFilter, uiState, filters, 'su', newFilter.subjects)
			uiUpdate(newFilter, uiState, filters, 'ty', newFilter.types)
			uiUpdate(newFilter, uiState, filters, 'gr', newFilter.groups)
			uiUpdate(newFilter, uiState, filters, 'le', newFilter.lecturers)
			uiUpdate(newFilter, uiState, filters, 'cl', newFilter.classrooms)
      uiUpdate(newFilter, uiState, filters, 'da', newFilter.days)
      uiUpdate(newFilter, uiState, filters, 'ts', ['set', newFilter.timeStart])
      uiUpdate(newFilter, uiState, filters, 'te', ['set', newFilter.timeEnd])
      
    }
    // eslint-disable-next-line
  }, [dispatch, telemetry, fromExisting])

  return (
    <Segment color={fromExisting ? 'blue' : 'green'} padded raised>
      <Header size='large'>{fromExisting ? 'Izmeni' : 'Novi'} filter</Header>
      <Header size='medium'>
        Studijski program
        {newFilter.studyPrograms.length === 0 ? 
        <Label circular empty color='red' size='tiny'/> : null}
      </Header>
      <Dropdown
          placeholder='Studijski program'
          disabled={newFilter.studyGroups.length > 0}
          fluid
          multiple
          selection
          search
          options={studyPrograms}
          onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'sp', value)}
					value={newFilter.studyPrograms}
      />
      <Header
        size='medium'
        color={newFilter.studyPrograms.length === 0 ? 'grey' : 'black'}
      >
        Studijska grupa
        {newFilter.studyGroups.length === 0 ?
        <Label circular empty color='red' size='tiny'/> : null}
      </Header>
      <Dropdown
          placeholder='Studijska grupa'
          disabled={newFilter.studyPrograms.length === 0 || newFilter.semesters.length > 0}
          fluid
          multiple
          selection
          search
          options={studyGroups}
          onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'sg', value)}
					defaultValue={newFilter.studyGroups}
      />
      <Header
        size='medium'
        color={newFilter.studyGroups.length === 0 ? 'grey' : 'black'}
      >
        Semestar
        {newFilter.semesters.length === 0 ?
        <Label circular empty color='red' size='tiny'/> : null}
      </Header>
      <Dropdown
          placeholder='Semestar'
          disabled={newFilter.studyGroups.length === 0 || newFilter.subjects.length > 0}
          fluid
          multiple
          selection
          options={semesters}
          onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'sm', value)}
					value={newFilter.semesters}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 || 
               newFilter.types.length > 0 || newFilter.groups.length > 0 ? 'grey' : 'black'}
      >Predmet</Header>
      <Dropdown
        placeholder='Predmet'
        disabled={newFilter.semesters.length === 0 || 
                  newFilter.types.length > 0 || newFilter.groups.length > 0 ||
                  newFilter.lecturers.length > 0 || newFilter.classrooms.length > 0}
        fluid
        multiple
        selection
        search
        options={subjects}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'su', value)}
				value={newFilter.subjects}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Vrsta nastave</Header>
      <Dropdown
        placeholder='Vrsta nastave'
        disabled={newFilter.semesters.length === 0}
        fluid
        multiple
        selection
        options={types}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'ty', value)}
				value={newFilter.types}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Grupa</Header>
      <Dropdown
        placeholder='Grupa'
        disabled={newFilter.semesters.length === 0}
        fluid
        multiple
        selection
        search
        options={groups}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'gr', value)}
				value={newFilter.groups}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Izvođač nastave</Header>
      <Dropdown
        placeholder='Izvođač nastave'
        disabled={newFilter.semesters.length === 0}
        fluid
        multiple
        selection
        search
        options={lecturers}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'le', value)}
				value={newFilter.lecturers}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Učionica</Header>
      <Dropdown
        placeholder='Učionica'
        disabled={newFilter.semesters.length === 0}
        fluid
        multiple
        selection
        search
        options={classrooms}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'cl', value)}
				value={newFilter.classrooms}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Dan</Header>
      <Dropdown
        placeholder='Dan'
        disabled={newFilter.semesters.length === 0}
        fluid
        multiple
        selection
        options={days}
        onChange={(e, {value}) => uiUpdate(newFilter, uiState, filters, 'da', value)}
				value={newFilter.days}
      />
      <Header
        size='medium'
        color={newFilter.semesters.length === 0 ? 'grey' : 'black'}
      >Vremenski period</Header>
      <Grid columns={2} stackable>
        <Grid.Column>
          <Button.Group fluid>
            <Button
							icon='left chevron'
              disabled={newFilter.semesters.length === 0}
              onClick={() => uiUpdate(newFilter, uiState, filters, 'ts', ['sub'])}
            />
            <Button
							basic={newFilter.timeStart + 0.5 <= newFilter.timeEnd}
							color={newFilter.timeStart + 0.5 > newFilter.timeEnd ? 'orange' : undefined}
              disabled={newFilter.semesters.length === 0}
              content={'od ' + timeString(newFilter.timeStart)}
            />
            <Button
							icon='right chevron'
							basic={newFilter.timeEnd <= newFilter.timeStart + 0.5}
              disabled={newFilter.semesters.length === 0}
              onClick={() => uiUpdate(newFilter, uiState, filters, 'ts', ['add'])}
            />
          </Button.Group>
        </Grid.Column>
        <Grid.Column>
          <Button.Group fluid>
            <Button
							icon='left chevron'
							basic={newFilter.timeEnd <= newFilter.timeStart + 0.5}
              disabled={newFilter.semesters.length === 0}
              onClick={() => uiUpdate(newFilter, uiState, filters, 'te', ['sub'])}
							/>
            <Button
              basic={newFilter.timeEnd >= newFilter.timeStart + 0.5}
							color={newFilter.timeEnd < newFilter.timeStart + 0.5 ? 'orange' : undefined}
              disabled={newFilter.semesters.length === 0}
              content={'do ' + timeString(newFilter.timeEnd)}
            />
            <Button
              icon='right chevron'
              disabled={newFilter.semesters.length === 0}
              onClick={() => uiUpdate(newFilter, uiState, filters, 'te', ['add'])}
            />
          </Button.Group>
        </Grid.Column>
      </Grid>
      <Divider hidden />
      <Grid columns={2}>
        <Grid.Column>
          <Button
            fluid
            color='red'
            onClick={() => {
              dispatch(closeNewFilter())
              if (telemetry)
                ReactGA.event({
                  category: 'Filters',
                  action: 'Cancel new filter'
                })
            }}
          >Nazad</Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            disabled={newFilter.semesters.length === 0 || newFilter.timeStart + 0.5 > newFilter.timeEnd}
            fluid
            color={fromExisting ? 'blue' : 'green'}
            onClick={() => {
              if (telemetry)
                ReactGA.event({
                  category: 'Filters',
                  action: fromExisting ? 'Edit existing filter' : 'Add new filter'
								})
							if (newFilter.existingID !== undefined)
								dispatch(updateSaveExistingFilter(newFilter.existingID, newFilter))
							else
								dispatch(addNewFilter(newFilter))
            }}
          >{fromExisting ? 'Sačuvaj' : 'Dodaj'}</Button>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default NewFilter