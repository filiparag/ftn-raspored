import React from 'react'
import { Segment, Header, Grid, Label, Icon } from 'semantic-ui-react'
import { FilterEntry } from '../store/filters/types'
import { useDispatch } from 'react-redux'
import { removeExistingFilter } from '../store/filters/actions'
import { timeString } from './TimetableEntry'

export interface ExistingFilterProps {
  id: number,
  entry: FilterEntry
}

const ExistingFilter: React.FC<ExistingFilterProps> = ({id, entry}) => {

  const dispatch = useDispatch()

  const notDefined = 'Nije određeno'

  return (
    <Segment color='grey' padded raised>
      <Grid columns={2}>
        <Grid.Column>
          <Header size='large'>Filter #{id + 1}</Header>
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Label
            as='a'
            basic
            color='red'
            onClick={() => dispatch(removeExistingFilter(id))}>
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
      <Header size='medium'>Vreme</Header>
      <p>
        od {timeString(entry.timeStart)} do {timeString(entry.timeEnd)}
      </p>
    </Segment>
  )
}

export default ExistingFilter