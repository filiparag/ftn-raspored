import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { viewPage } from '../store/menu/actions'
import { connect } from 'react-redux'
import { Action } from 'typesafe-actions'
import { Header, Dropdown, Divider, Button, Segment } from 'semantic-ui-react'
import { Filter } from '../store/filters/types'
import { typeName } from '../components/TimetableEntry'

type FiltersProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps> & {
  filters: Filter
}

interface DropdownEntry {
  key: number | string,
  text: string,
  value: number | string
}

export const Filters: React.FC<FiltersProps> = ({filters, changePage}) => {

  const selected = {
    studyPrograms: [] as Array<number>,
    studyGroups: [] as Array<number>,
    semesters: [] as Array<number>,
    subjects: [] as Array<number>,
    groups: [] as Array<string>,
    types: [] as Array<number>
  }

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

  const naturalSortEntries = (array: DropdownEntry[]) => {
    array.sort((a, b) => {
      return a.text.localeCompare(b.text, undefined, {numeric: true, sensitivity: 'base'});
    });
  }

  naturalSortEntries(studyPrograms)

  const updateSelection = (group: string, value: any) => {
      switch (group) {
        case 'sp': {
          selected.studyPrograms.splice(0, selected.studyPrograms.length)
          studyGroups.splice(0, studyGroups.length)
          for (const sp of filters) {
            selected.studyPrograms.push(sp.id)
            if (value.includes(sp.id)) {
              for (const sg of sp.studyGroups) {
                studyGroups.push({
                  key: sg.id,
                  text: (sg.name === 'SVI') ? sp.name + ' - ' + sg.name : sg.name,
                  value: sg.id
                })
              }
            }
          }
          naturalSortEntries(studyGroups)
          break
        }
        case 'sg': {
          selected.studyGroups.splice(0, selected.studyGroups.length)
          semesters.splice(0, studyGroups.length)
          for (const sp of filters) {
            if (selected.studyPrograms.includes(sp.id)) {
              for (const sg of sp.studyGroups) {
                selected.studyGroups.push(sg.id)
                if (value.includes(sg.id)) {
                  for (const sm of sg.semesters) {
                    semesters.push({
                      key: sm.id,
                      text: ((sg.name === 'SVI') ? sp.name : sg.name) + ' - ' + sm.name + ' semestar',
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
          selected.semesters.splice(0, selected.semesters.length)
          subjects.splice(0, subjects.length)
          for (const sp of filters) {
            if (selected.studyPrograms.includes(sp.id)) {
              for (const sg of sp.studyGroups) {
                if (selected.studyGroups.includes(sg.id)) {
                  for (const sm of sg.semesters) {
                    selected.semesters.push(sm.id)
                    if (value.includes(sm.id)) {
                      for (const su of sm.subjects) {
                        subjects.push({
                          key: su.id,
                          text: ((sg.name === 'SVI') ? sp.name : sg.name) + ' - ' + su.name,
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
          selected.groups.splice(0, selected.groups.length)
          selected.types.splice(0, selected.types.length)
          groups.splice(0, groups.length)
          types.splice(0, types.length)
          for (const sp of filters) {
            if (selected.studyPrograms.includes(sp.id)) {
              for (const sg of sp.studyGroups) {
                if (selected.studyGroups.includes(sg.id)) {
                  for (const sm of sg.semesters) {
                    if (selected.semesters.includes(sm.id)) {
                      for (const su of sm.subjects) {
                        if (value.includes(su.id)) {
                          for (const gr of su.groups) {
                            if (!selected.groups.includes(gr)) {
                              groups.push({
                                key: gr,
                                text: gr,
                                value: gr
                              })
                              selected.groups.push(gr)
                            }
                          }
                          for (const ty of su.types) {
                            if (!selected.types.includes(ty.id)) {
                              types.push({
                                key: ty.id,
                                text: typeName(ty.name),
                                value: ty.id
                              })
                              selected.types.push(ty.id)
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
          naturalSortEntries(groups)
          naturalSortEntries(types)
          break
        }
      }
  }

  return (
    <div>
      <Header size='huge'>Filteri</Header>
      <Segment color='green' padded>
        <Header size='medium'>Novi filter</Header>
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
        <Header size='small'>Predmet</Header>
        <Dropdown
          placeholder='Predmet'
          fluid
          multiple
          selection
          options={subjects}
          onChange={(e, {value}) => updateSelection('su', value)}
        />
        <Header size='small'>Vrsta nastave</Header>
        <Dropdown
          placeholder='Vrsta nastave'
          fluid
          multiple
          selection
          options={types}
        />
        <Header size='small'>Grupa</Header>
        <Dropdown
          placeholder='Grupa'
          fluid
          multiple
          selection
          options={groups}
        />
        <Divider hidden />
        <Button fluid color='green'>Dodaj</Button>
      </Segment>
      <Segment padded>
        <Header size='medium'>Filter </Header>
        <Header size='small'>Predmet</Header>
        <p>
          
        </p>
        <Header size='small'>Vrsta nastave</Header>
        <p>
          
        </p>
        <Header size='small'>Grupa</Header>
        <p>
          
        </p>
        <Divider hidden />
        <Button basic fluid color='red'>Obriši</Button>
      </Segment>
    </div>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  filters: state.filter,
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
    changePage: viewPage,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters)