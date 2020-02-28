import React, { useState } from 'react'
import { ApplicationState } from '../store'
import { useSelector, useDispatch } from 'react-redux'
import { Header, Dropdown, Divider, Button, Segment, Grid, Label } from 'semantic-ui-react'
import { typeName } from '../components/TimetableEntry'
import { closeNewFilter, addNewFilter, updateResetNewFilter, updateAddNewFilter } from '../store/filters/actions'
import { timeString as compactTimeString } from '../components/TimetableEntry'

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

export const naturalSortEntries = (array: DropdownEntry[]): DropdownEntry[] => {
  return array.sort((a, b) => {
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

  const dropdownObject = (text: string, key: number | string): DropdownEntry => {
    return {
      key: key,
      value: key,
      text: text
    }
  }

  var spArray = [] as DropdownEntry[]
  for (const sp of filters)
    spArray.push(dropdownObject(sp.name, sp.id))

  const dayStrings = [
    'Ponedeljak', 'Utorak', 'Sreda', 
    'Četvrtak', 'Petak', 'Subota', 'Nedelja'
  ]
  var days = [] as DropdownEntry[]
    for (const day in dayStrings)
      days.push(dropdownObject(dayStrings[day], day))

  const [studyPrograms] = useState(naturalSortEntries(spArray))
  const [studyGroups, sgSet] = useState([] as DropdownEntry[])
  const [semesters, smSet] = useState([] as DropdownEntry[])
  const [subjects, suSet] = useState([] as DropdownEntry[])
  const [groups, grSet] = useState([] as DropdownEntry[])
  const [types, tySet] = useState([] as DropdownEntry[])

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
                                           + abbrevateName(sp.name)})`
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
        grSet(naturalSortEntries(grArray))
        tySet(naturalSortEntries(tyArray))
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
                                     '' : ', '}${typeName(types[
                                     types.findIndex(el => el.value === v)].text)}`
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
    <Segment color='green' padded raised>
      <Header size='large'>Novi filter</Header>
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
          options={studyPrograms}
          onChange={(e, {value}) => updateSelection('sp', value)}
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
          options={studyGroups}
          onChange={(e, {value}) => updateSelection('sg', value)}
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
      />
      <Divider hidden />
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
        options={subjects}
        onChange={(e, {value}) => updateSelection('su', value)}
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
        options={groups}
        onChange={(e, {value}) => updateSelection('gr', value)}
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
              basic
              disabled={newFilter.semesters.length === 0}
              content={'od ' + timeString(newFilter.timeStart)}
            />
            <Button
              icon='right chevron'
              disabled={newFilter.semesters.length === 0}
              onClick={() => dispatch(updateAddNewFilter('ts', 'add'))}
            />
          </Button.Group>
        </Grid.Column>
        <Grid.Column>
          <Button.Group fluid>
            <Button
              icon='left chevron'
              disabled={newFilter.semesters.length === 0}
              onClick={() => dispatch(updateAddNewFilter('te', 'sub'))}
            />
            <Button
              basic
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
            onClick={() => dispatch(closeNewFilter())}
          >Nazad</Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            disabled={newFilter.semesters.length === 0}
            fluid
            color='green'
            onClick={() => {dispatch(addNewFilter(newFilter))}}
          >Dodaj</Button>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default NewFilter