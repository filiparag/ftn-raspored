import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga';
import { ApplicationState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { Header, Dropdown, Divider, Button, Segment, Grid, Label } from 'semantic-ui-react'
import { typeName, timeString } from '../TimetableEntry'
import { closeNewFilter, addNewFilter, updateResetNewFilter, updateAddNewFilter, fetchFilters, updateSaveExistingFilter } from '../../store/filters/actions'
import { timeString as compactTimeString } from '../TimetableEntry'
import { DropdownEntry, dayStrings } from './data'
import { abbrevateName, naturalSortEntries, dropdownObject } from './functions';
import { ddStudyPrograms, ddDays } from './methods';

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

  const [studyPrograms] = useState(ddStudyPrograms(filters))
  const [studyGroups, sgSet] = useState([] as DropdownEntry[])
  const [semesters, smSet] = useState([] as DropdownEntry[])
  const [subjects, suSet] = useState([] as DropdownEntry[])
  const [groups, grSet] = useState([] as DropdownEntry[])
  const [types, tySet] = useState([] as DropdownEntry[])
  const [lecturers, leSet] = useState([] as DropdownEntry[])
  const [classrooms, clSet] = useState([] as DropdownEntry[])
	const [days] = useState(ddDays())
	
  useEffect(() => {
		fetchFilters(dispatch)
    if (telemetry)
      ReactGA.pageview("/filters/new")
		if (fromExisting || newFilter.shared) {
			updateSelection('sp', newFilter.studyPrograms)
			updateSelection('sg', newFilter.studyGroups)
			updateSelection('sm', newFilter.semesters)
			updateSelection('su', newFilter.subjects)
			updateSelection('ty', newFilter.types)
			updateSelection('gr', newFilter.groups)
			updateSelection('le', newFilter.lecturers)
			updateSelection('cl', newFilter.classrooms)
			updateSelection('da', newFilter.days)
    }
  }, [dispatch, telemetry, fromExisting])

  const updateSelection = (group: string, value: any) => {
    const dispatchPayload = {
      group: '',
      values: [] as number[],
      string: ''
    }
    switch (group) {
      case 'sp': {
        dispatchPayload.group='sp'
        const sgArray = [] as DropdownEntry[]
        for (const sp of filters) {
          if (value.includes(sp.id)) {
            dispatchPayload.values.push(sp.id)
            dispatchPayload.string += `${dispatchPayload.string.length === 0
                                       ? '' : ', '}${sp.name}`
            for (const sg of sp.studyGroups) {
              const name = sg.name === 'SVI' ? sp.name : 
                           `${sg.name} (${abbrevateName(sp.name)})`
              sgArray.push(dropdownObject(name, sg.id))
            }
          }
        }
        sgSet(naturalSortEntries(sgArray))
        break
      }
      case 'sg': {
        dispatchPayload.group='sg'
        const smArray = [] as DropdownEntry[]
        for (const sp of filters) {
          if (newFilter.studyPrograms.includes(sp.id)) {
            for (const sg of sp.studyGroups) {
              if (value.includes(sg.id)) {
                dispatchPayload.values.push(sg.id)
                dispatchPayload.string += `${dispatchPayload.string.length === 0
                                           ? '' : ', '}${sg.name === 'SVI'
                                           ? sp.name : sg.name + ' (' 
                                           + abbrevateName(sp.name) + ')'}`
                for (const sm of sg.semesters) {
                  const name = `${sm.name} semestar (${sg.name === 'SVI' ? 
                                abbrevateName(sp.name) : abbrevateName(sp.name)
                                + ' ' + abbrevateName(sg.name)})`
                  smArray.push(dropdownObject(name, sm.id))
                }
              }
            }
          }
        }
        smSet(naturalSortEntries(smArray))
        break
      }
      case 'sm': {
        dispatchPayload.group='sm'
        const suArray = [] as DropdownEntry[]
        const grArray = [] as DropdownEntry[]
        const tyArray = [] as DropdownEntry[]
        const cachedGroups = [] as string[]
        const cachedTypes = [] as number[]
        for (const sp of filters) {
          if (newFilter.studyPrograms.includes(sp.id)) {
            for (const sg of sp.studyGroups) {
              if (newFilter.studyGroups.includes(sg.id)) {
                for (const sm of sg.semesters) {
                  if (value.includes(sm.id)) {
                    dispatchPayload.values.push(sm.id)
                    dispatchPayload.string += `${dispatchPayload.string.length === 0
                                               ? '' : ', '}${sm.name} semestar (${
                                               sg.name === 'SVI'
                                               ? abbrevateName(sp.name)
                                               : abbrevateName(sp.name) + ' '
                                               + abbrevateName(sg.name)})`
                    for (const su of sm.subjects) {
                      const name = `${su.name} (${sg.name === 'SVI' ? 
                                    abbrevateName(sp.name) : abbrevateName(sp.name)
                                    + ' ' + abbrevateName(sg.name)})`
                      suArray.push(dropdownObject(name, su.id))
                      for (const gr of su.groups) {
                        if (!cachedGroups.includes(gr)) {
                          cachedGroups.push(gr)
                          grArray.push(dropdownObject(gr, gr))
                        }
                      }
                      for (const ty of su.types) {
                        if (!cachedTypes.includes(ty.id)) {
                          cachedTypes.push(ty.id)
                          tyArray.push(dropdownObject(typeName(ty.name), ty.id))
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        suSet(naturalSortEntries(suArray))
        grSet(naturalSortEntries(grArray))
        tySet(naturalSortEntries(tyArray))
        break
      }
      case 'su': {
        dispatchPayload.group='su'
        const grArray = [] as DropdownEntry[]
        const tyArray = [] as DropdownEntry[]
        const leArray = [] as DropdownEntry[]
        const clArray = [] as DropdownEntry[]
        const cachedGroups = [] as string[]
        const cachedTypes = [] as number[]
        const cachedLecturers = [] as string[]
        const cachedClassrooms = [] as string[]
        for (const sp of filters) {
          if (newFilter.studyPrograms.includes(sp.id)) {
            for (const sg of sp.studyGroups) {
              if (newFilter.studyGroups.includes(sg.id)) {
                for (const sm of sg.semesters) {
                  if (newFilter.semesters.includes(sm.id)) {
                    for (const su of sm.subjects) {
                      if (value.includes(su.id)) {
                        dispatchPayload.values.push(su.id)
                        dispatchPayload.string += `${dispatchPayload.string.length === 0
                                                   ? '' : ', '}${su.name} (${
                                                   sg.name === 'SVI'
                                                   ? abbrevateName(sp.name)
                                                   : abbrevateName(sp.name) + ' '
                                                   + abbrevateName(sg.name)})`
                      }
                      if (value.length === 0 || value.includes(su.id)) {
                        for (const gr of su.groups) {
                          if (!cachedGroups.includes(gr)) {
                            cachedGroups.push(gr)
                            grArray.push(dropdownObject(gr, gr))
                          }
                        }
                        for (const ty of su.types) {
                          if (!cachedTypes.includes(ty.id)) {
                            cachedTypes.push(ty.id)
                            tyArray.push(dropdownObject(typeName(ty.name), ty.id))
                          }
                        }
                        for (const le of su.lecturers) {
                          if (!cachedLecturers.includes(le)) {
                            cachedLecturers.push(le)
                            leArray.push(dropdownObject(le, le))
                          }
                        }
                        for (const cl of su.classrooms) {
                          if (!cachedClassrooms.includes(cl)) {
                            cachedClassrooms.push(cl)
                            clArray.push(dropdownObject(cl, cl))
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        dispatch(updateResetNewFilter('gr'))
        dispatch(updateResetNewFilter('ty'))
        dispatch(updateResetNewFilter('le'))
				dispatch(updateResetNewFilter('cl'))
        grSet(naturalSortEntries(grArray))
				tySet(naturalSortEntries(tyArray))
        leSet(naturalSortEntries(leArray))
        clSet(naturalSortEntries(clArray))
        break
      }
      case 'gr': {
        dispatchPayload.group='gr'
        dispatchPayload.values = value
        value.forEach((v: string) => {
          dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
                                     '' : ', '}${v}`
        });
        break
      }
      case 'ty': {
        dispatchPayload.group='ty'
				dispatchPayload.values = value
				for (const sp of filters) {
          if (newFilter.studyPrograms.includes(sp.id)) {
            for (const sg of sp.studyGroups) {
              if (newFilter.studyGroups.includes(sg.id)) {
                for (const sm of sg.semesters) {
                  if (newFilter.semesters.includes(sm.id)) {
                    for (const su of sm.subjects) {
                      if (newFilter.subjects.includes(su.id)) {
												for (const ty of su.types) {
													if (value.includes(ty.id)) {
														dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
																											 '' : ', '}${typeName(ty.name)}`
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
        break
      }
      case 'le': {
        dispatchPayload.group='le'
        dispatchPayload.values = value
        value.forEach((v: string) => {
          dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
                                     '' : ', '}${v}`
        });
        break
      }
      case 'cl': {
        dispatchPayload.group='cl'
        dispatchPayload.values = value
        value.forEach((v: string) => {
          dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
                                     '' : ', '}${v}`
        });
        break
      }
      case 'da': {
        dispatchPayload.group='da'
        dispatchPayload.values = value
        value.forEach((v: number) => {
          dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
                                     '' : ', '}${dayStrings[
                                     days.findIndex(el => el.value === v)]}`
        });
        break
      }
    }
    dispatch(updateResetNewFilter(dispatchPayload.group))
    dispatch(updateAddNewFilter(dispatchPayload.group, {
      id: dispatchPayload.values, string: dispatchPayload.string
    }))
    dispatch(updateAddNewFilter('ts', compactTimeString(newFilter.timeStart)))
    dispatch(updateAddNewFilter('te', compactTimeString(newFilter.timeEnd)))
  }

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
					onChange={(e, {value}) => updateSelection('sp', value)}
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
					onChange={(e, {value}) => updateSelection('sg', value)}
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
					onChange={(e, {value}) => updateSelection('sm', value)}
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
                  newFilter.types.length > 0 || newFilter.groups.length > 0}
        fluid
        multiple
        selection
        search
        options={subjects}
				onChange={(e, {value}) => updateSelection('su', value)}
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
				onChange={(e, {value}) => updateSelection('ty', value)}
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
				onChange={(e, {value}) => updateSelection('gr', value)}
				value={newFilter.groups}
      />
      <Header
        size='medium'
        color={newFilter.subjects.length === 0 ? 'grey' : 'black'}
      >Izvođač nastave</Header>
      <Dropdown
        placeholder='Izvođač nastave'
        disabled={newFilter.subjects.length === 0}
        fluid
        multiple
        selection
        search
        options={lecturers}
				onChange={(e, {value}) => updateSelection('le', value)}
				value={newFilter.lecturers}
      />
      <Header
        size='medium'
        color={newFilter.subjects.length === 0 ? 'grey' : 'black'}
      >Učionica</Header>
      <Dropdown
        placeholder='Učionica'
        disabled={newFilter.subjects.length === 0}
        fluid
        multiple
        selection
        search
        options={classrooms}
				onChange={(e, {value}) => updateSelection('cl', value)}
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
				onChange={(e, {value}) => updateSelection('da', value)}
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
              onClick={() => dispatch(updateAddNewFilter('ts', 'sub'))}
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
              onClick={() => dispatch(updateAddNewFilter('ts', 'add'))}
            />
          </Button.Group>
        </Grid.Column>
        <Grid.Column>
          <Button.Group fluid>
            <Button
							icon='left chevron'
							basic={newFilter.timeEnd <= newFilter.timeStart + 0.5}
              disabled={newFilter.semesters.length === 0}
              onClick={() => dispatch(updateAddNewFilter('te', 'sub'))}
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
              onClick={() => dispatch(updateAddNewFilter('te', 'add'))}
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