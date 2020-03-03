import React from 'react'
import ReactGA from 'react-ga';
import { Segment, Header, Grid, Label, Icon } from 'semantic-ui-react'
import { FilterEntry } from '../store/filters/types'
import { useDispatch, useSelector } from 'react-redux'
import { removeExistingFilter } from '../store/filters/actions'
import '../style/Filter.css'
import { ApplicationState } from '../store';
import { fetchTimetable, cleanTimetable } from '../store/timetable/actions';

export interface ExistingFilterProps {
  id: number,
  entry: FilterEntry
}

const ExistingFilter: React.FC<ExistingFilterProps> = ({id, entry}) => {

  const dispatch = useDispatch()

  const telemetry = useSelector(
    (state: ApplicationState) => state.preferences.telemetry
  )

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
            onClick={() => {
              if (telemetry)
                ReactGA.event({
                  category: 'Filters',
                  action: 'Remove existing filter'
                })
              dispatch(removeExistingFilter(id))
              dispatch(cleanTimetable())
            }}>
            <Icon name='trash alternate' />
            Obriši
          </Label>
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
      {entry.daString.length > 0 ?
          <section>
          <Header size='medium'>Dan</Header>
          <p>
            {entry.daString}
          </p>
        </section>
      : null}
      {entry.tsString.length > 0 || entry.teString.length > 0 ?
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