import React from 'react'
import { Segment, Header, Grid, Label, Icon } from 'semantic-ui-react'
import { FilterEntry, FilterChild } from '../store/filters/types'
import { useSelector, useDispatch } from 'react-redux'
import { ApplicationState } from '../store'
import { abbrevateName } from './NewFilter'
import { removeExistingFilter } from '../store/filters/actions'

export interface ExistingFilterProps {
  id: number,
  entry: FilterEntry
}

const ExistingFilter: React.FC<ExistingFilterProps> = ({id, entry}) => {

  const dispatch = useDispatch()
  const filter = useSelector(
    (state: ApplicationState) => state.filter
  )

  const searchById = (id: number | string, tree: Array<any>, depth: number, d: number = 0): string | null => {
    if (d === depth)
      if (tree as Array<FilterChild>) {
        const index = tree.findIndex((el) => el.id === id)
        if (index >= 0)
          return tree[index].name
      } else {
        const index = tree.findIndex((el: string) => el === id)
        if (index >= 0)
          return tree[index]
      }
    else
      if (d === 0)
        return Array.from(new Set(tree.map((node) => {
          var res = searchById(id, node.studyGroups, depth, d + 1)
          if (depth === 1)
            if (res === 'SVI')
              res = node.name
            else if (res !== null)
              res += ` (${abbrevateName(node.name)})`
          return res
        }).filter(el => el !== null))).join('')
      else if (d === 1)
        return Array.from(new Set(tree.map((node) => {
          var res = searchById(id, node.semesters, depth, d + 1)
          if (depth === 2 && res !== null)
            res += ' semestar'
            if (res !== null && node.name !== 'SVI')
              res += ` (${abbrevateName(node.name)})`
          return res
        }).filter(el => el !== null))).join('')
      else if (d === 2)
        return Array.from(new Set(tree.map((node) => {
          var res = searchById(id, node.subjects, depth, d + 1)
          return res
        }).filter(el => el !== null))).join('')
      else if (d === 3)
        return Array.from(new Set(tree.map((node) => {
          var res = searchById(id, node.types, depth, d + 1)
          return res
        }).filter(el => el !== null))).join('+')
    return null
  }

  // const studyPrograms = entry.studyPrograms.map(el => searchById(el, filter, 0)).join('; ')
  // const studyGroups = entry.studyGroups.map(el => searchById(el, filter, 1)).join('; ')
  // const semesters = entry.semesters.map(el => searchById(el, filter, 2)).join('; ')
  // const subjects = entry.subjects.map(el => searchById(el, filter, 3)).join('; ')
  // const types = entry.types.map(el => searchById(el, filter, 4)).join('; ')
  // const groups = entry.groups.map(el => searchById(el, filter, 4)).join('; ')

  const notDefined = 'Nije određeno'

  return (
    <Segment color='grey' padded raised>
      <Grid columns={2}>
        <Grid.Column>
          <Header size='large'>Filter #{id + 1}</Header>
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Label as='a' basic color='red' onClick={() => dispatch(removeExistingFilter(id))}>
            <Icon name='trash alternate' />
            Obriši
          </Label>
        </Grid.Column>
      </Grid>
      <Header size='medium'>Studijski program</Header>
      <p>
        {entry.spString.length > 0 ? entry.spString : notDefined}
      </p>
      <Header size='medium'>Studijska grupa</Header>
      <p>
        {entry.sgString.length > 0 ? entry.sgString : notDefined}
      </p>
      <Header size='medium'>Semestar</Header>
      <p>
        {entry.smString.length > 0 ? entry.smString : notDefined}
      </p>
      <Header size='medium'>Predmet</Header>
      <p>
        {entry.suString.length > 0 ? entry.suString : notDefined}
      </p>
      <Header size='medium'>Vrsta nastave</Header>
      <p>
        {entry.tyString.length > 0 ? entry.tyString : notDefined}
      </p>
      <Header size='medium'>Grupa</Header>
      <p>
        {entry.grString.length > 0 ? entry.grString : notDefined}
      </p>
    </Segment>
  )
}

export default ExistingFilter