import React, { useEffect } from 'react'
import ReactGA from 'react-ga';
import { ApplicationState } from '../store'
import { Header, Button, Grid, Message } from 'semantic-ui-react'
import { NewFilter } from '../components/NewFilter'
import ExistingFilter from '../components/ExistingFilter'
import { showNewFilter } from '../store/filters/actions'
import { useDispatch, useSelector } from 'react-redux'
import { FilterEntry } from '../store/filters/types'

type FiltersProps = {}

export const Filters: React.FC<FiltersProps> = () => {
  
  const telemetry = useSelector(
    (state: ApplicationState) => state.preferences.telemetry
  )

  useEffect(() => {
    if (telemetry)
      ReactGA.pageview("/filters")
  }, [telemetry])

  const dispatch = useDispatch()

  const newFilterVisible = useSelector(
    (state: ApplicationState) => state.newFilter.visible
  )

  const existingFilters = useSelector(
    (state: ApplicationState) => state.existingFilters
  )
  
  const NoFiltersMessage = (
    <Message warning>
      <Message.Header>
        Nije pronađen nijedan filter
      </Message.Header>
      <p>
        Kako bi se u rasporedu prikazivali časovi, potrebno je dodati
        barem jedan filter.
      </p>
    </Message>
  )

  const ExistingFilters = existingFilters.map((
    filter: FilterEntry, index: number
  ) => {
    return (
      <ExistingFilter
        entry={filter}
        id={index}
        key={(Math.floor(Math.random() * 1000000)).toString()}
      />
    )
  })

  return (
    <div>
      <Grid columns={2}>
        <Grid.Column>
          <Header size='huge'>Filteri</Header>
        </Grid.Column>
        <Grid.Column>
          {newFilterVisible ? null : 
          <Button
            floated='right'
            color='green'
            icon='plus'
            content='Dodaj'
            labelPosition='right'
            onClick={() => dispatch(showNewFilter())}
          />}
        </Grid.Column>
      </Grid>
      {newFilterVisible ? <NewFilter /> :
      existingFilters.length === 0 ? NoFiltersMessage : ExistingFilters}
    </div>
  )
}

export default Filters