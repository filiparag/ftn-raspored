import React from 'react'
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import { Header, Dropdown, Divider, Button, Segment, Grid } from 'semantic-ui-react'
import { typeName } from '../components/TimetableEntry'
import { closeNewFilter, addNewFilter, updateResetNewFilter, updateAddNewFilter } from '../store/filters/actions'

type NewFilterProps = {}

interface DropdownEntry {
  key: number | string,
  text: string,
  value: number | string
}

export const timeString = (time: number): string => {
  let hour = '0' + Math.floor(time)
  let minute = '0' + Math.round((time - Math.floor(time)) * 60)
  return hour.substr(hour.length - 2) + ' : ' + minute.substr(minute.length - 2)
}

export const naturalSortEntries = (array: DropdownEntry[]) => {
  array.sort((a, b) => {
    return a.text.localeCompare(
      b.text, undefined,
      {numeric: true, sensitivity: 'base'}
    );
  });
}

export const abbrevateName = (name: string): string => {
  const words = name.split('-')[0].split(' ')
  var abbr = ''
  for (const w of words) {
    if (w === 'i') {
      continue
    } else if (w[0] !== undefined) {
      abbr += w[0].toLocaleUpperCase()
    }
  }
  return abbr
}

export const NewFilter: React.FC<NewFilterProps> = () => {

  const newFilter = useSelector((state: ApplicationState) => state.newFilter)
  const filters = useSelector((state: ApplicationState) => state.filter)
  const dispatch = useDispatch()

  const studyPrograms = [] as DropdownEntry[]
  for (const sp of filters) {
    studyPrograms.push({
      key: sp.id,
      text: sp.name,
      value: sp.id
    })
  }
  const studyGroups = [] as DropdownEntry[]
  const semesters = [] as DropdownEntry[]
  const subjects = [] as DropdownEntry[]
  const groups = [] as DropdownEntry[]
  const types = [] as DropdownEntry[]

  naturalSortEntries(studyPrograms)

  const updateSelection = (group: string, value: any) => {
    const dispatchPayload = {
      group: '',
      values: [] as number[],
      string: ''
    }
    switch (group) {
      case 'sp': {
        dispatchPayload.group='sp'
        studyGroups.splice(0, studyGroups.length)
        for (const sp of filters) {
          if (value.includes(sp.id)) {
            dispatchPayload.values.push(sp.id)
            dispatchPayload.string += `${dispatchPayload.string.length === 0
                                       ? '' : ', '}${sp.name}`
            for (const sg of sp.studyGroups) {
              const name = sg.name === 'SVI' ? sp.name : 
                           `${sg.name} (${abbrevateName(sp.name)})`
              studyGroups.push({
                key: sg.id,
                text: name,
                value: sg.id
              })
            }
          }
        }
        naturalSortEntries(studyGroups)
        break
      }
      case 'sg': {
        dispatchPayload.group='sg'
        semesters.splice(0, semesters.length)
        for (const sp of filters) {
          if (newFilter.studyPrograms.includes(sp.id)) {
            for (const sg of sp.studyGroups) {
              if (value.includes(sg.id)) {
                dispatchPayload.values.push(sg.id)
                dispatchPayload.string += `${dispatchPayload.string.length === 0
                                           ? '' : ', '}${sg.name === 'SVI'
                                           ? sp.name : sg.name + ' (' 
                                           + abbrevateName(sp.name)})`
                for (const sm of sg.semesters) {
                  const name = `${sm.name} semestar (${sg.name === 'SVI' ? 
                                abbrevateName(sp.name) : abbrevateName(sp.name)
                                + ' ' + abbrevateName(sg.name)})`
                  semesters.push({
                    key: sm.id,
                    text: name,
                    value: sm.id
                  })
                }
              }
            }
          }
        }
        naturalSortEntries(semesters)
        break
      }
      case 'sm': {
        dispatchPayload.group='sm'
        subjects.splice(0, subjects.length)
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
                      subjects.push({
                        key: su.id,
                        text: name,
                        value: su.id
                      })
                    }
                  }
                }
              }
            }
          }
        }
        naturalSortEntries(subjects)
        break
      }
      case 'su': {
        dispatchPayload.group='su'
        groups.splice(0, groups.length)
        types.splice(0, types.length)
        const cachedGroups = [] as string[]
        const cachedTypes = [] as number[]
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
                        for (const gr of su.groups) {
                          if (!cachedGroups.includes(gr)) {
                            cachedGroups.push(gr)
                            groups.push({
                              key: gr,
                              text: gr,
                              value: gr
                            })
                          }
                        }
                        for (const ty of su.types) {
                          if (!cachedTypes.includes(ty.id)) {
                            cachedTypes.push(ty.id)
                            types.push({
                              key: ty.id,
                              text: typeName(ty.name),
                              value: ty.id
                            })
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
        naturalSortEntries(groups)
        naturalSortEntries(types)
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
        value.forEach((v: number) => {
          dispatchPayload.string += `${dispatchPayload.string.length === 0 ?
                                     '' : ', '}${types[
                                     types.findIndex(el => el.value === v)].text}`
        });
        break
      }
    }
    dispatch(updateResetNewFilter(dispatchPayload.group))
    dispatch(updateAddNewFilter(dispatchPayload.group, {
      id: dispatchPayload.values, string: dispatchPayload.string
    }))
  }

  return (
    <Segment color='green' padded raised>
      <Header size='large'>Novi filter</Header>
      <Header size='medium'>Studijski program</Header>
      <Dropdown
          placeholder='Studijski program'
          fluid
          multiple
          selection
          options={studyPrograms}
          onChange={(e, {value}) => updateSelection('sp', value)}
      />
      <Header size='medium'>Studijska grupa</Header>
      <Dropdown
          placeholder='Studijska grupa'
          fluid
          multiple
          selection
          options={studyGroups}
          onChange={(e, {value}) => updateSelection('sg', value)}
      />
      <Header size='medium'>Semestar</Header>
      <Dropdown
          placeholder='Semestar'
          fluid
          multiple
          selection
          options={semesters}
          onChange={(e, {value}) => updateSelection('sm', value)}
      />
      <Divider hidden />
      <Header size='medium'>Predmet</Header>
      <Dropdown
        placeholder='Predmet'
        fluid
        multiple
        selection
        options={subjects}
        onChange={(e, {value}) => updateSelection('su', value)}
      />
      <Header size='medium'>Vrsta nastave</Header>
      <Dropdown
        placeholder='Vrsta nastave'
        fluid
        multiple
        selection
        options={types}
        onChange={(e, {value}) => updateSelection('ty', value)}
      />
      <Header size='medium'>Grupa</Header>
      <Dropdown
        placeholder='Grupa'
        fluid
        multiple
        selection
        options={groups}
        onChange={(e, {value}) => updateSelection('gr', value)}
      />
      {/* <Header size='medium'>Vremenski period</Header>
      <Grid columns={2} stackable>
        <Grid.Column>
          <Button.Group fluid>
            <Button icon='left chevron' onClick={() => dispatch(updateAddNewFilter('ts', 'sub'))}/>
            <Button basic content={'od ' + timeString(useSelector((state: ApplicationState) => state.newFilter.timeStart))} />
            <Button icon='right chevron' onClick={() => dispatch(updateAddNewFilter('ts', 'add'))}/>
          </Button.Group>
        </Grid.Column>
        <Grid.Column>
          <Button.Group fluid>
            <Button icon='left chevron' onClick={() => dispatch(updateAddNewFilter('te', 'sub'))} />
            <Button basic content={'do ' + timeString(useSelector((state: ApplicationState) => state.newFilter.timeEnd))} />
            <Button icon='right chevron' onClick={() => dispatch(updateAddNewFilter('te', 'add'))} />
          </Button.Group>
        </Grid.Column>
      </Grid> */}
      <Divider hidden />
      <Grid columns={2}>
        <Grid.Column>
          <Button
            fluid
            color='red'
            onClick={() => dispatch(closeNewFilter())}
          >Nazad</Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            disabled={false}
            fluid
            color='green'
            onClick={() => dispatch(addNewFilter(newFilter))}
          >Dodaj</Button>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default NewFilter