import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { viewPage } from '../store/menu/actions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Action } from 'typesafe-actions'
import { Header, Divider, Button, Segment, Grid } from 'semantic-ui-react'
import { NewFilter } from '../components/NewFilter'
import { showNewFilter, closeNewFilter } from '../store/filters/actions'

type FiltersProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps>

export const Filters: React.FC<FiltersProps> = ({filters, changePage}) => {
  
  const dispatch = useDispatch()
  const newFilterVisible = useSelector((state: ApplicationState) => state.newFilter.visible)
  
  return (
    <div>
      <Grid columns={2}>
        <Grid.Column>
          <Header size='huge'>Filteri</Header>
        </Grid.Column>
        <Grid.Column>
          {newFilterVisible ? null : 
          <Button floated='right' color='green' icon='plus' content='Dodaj' labelPosition='right' onClick={() => dispatch(showNewFilter())}/>}
        </Grid.Column>
      </Grid>
      {newFilterVisible ? <NewFilter /> : null}
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