import React from 'react'
import { ApplicationState } from '../store'
import { Header, Button, Grid, Message } from 'semantic-ui-react'
import { NewFilter } from '../components/NewFilter'
import ExistingFilter from '../components/ExistingFilter'
import { showNewFilter } from '../store/filters/actions'
import { useDispatch, useSelector } from 'react-redux'

type FiltersProps = {}

export const Filters: React.FC<FiltersProps> = () => {
  
  const dispatch = useDispatch()
  const newFilterVisible = useSelector(
    (state: ApplicationState) => state.newFilter.visible
  )
  const filters = useSelector(
    (state: ApplicationState) => state.existingFilters
  )

  const rows = []
  for (const fi in filters) {
    rows.push(<ExistingFilter entry={filters[fi]} key={parseInt(fi)} />)
  }

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
      {newFilterVisible ? <NewFilter /> : (rows.length > 0 ? rows : NoFiltersMessage)}
    </div>
  )
}

export default Filters