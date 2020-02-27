import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { PageName } from '../store/menu/types'
import { viewPage } from '../store/menu/actions'
import { connect } from 'react-redux'
import { Action } from 'typesafe-actions'
import { Header, Dropdown, Divider, Button, Segment, Label } from 'semantic-ui-react'

type FiltersProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps> & {
  page: PageName
}

export const Filters: React.FC<FiltersProps> = ({page, changePage}) => {
  return (
    <div>
      <Header size='huge'>Filteri</Header>
      <Segment color='green' padded>
        <Header size='medium'>Novi filter</Header>
        <Header size='medium'>Studijski program</Header>
        <Dropdown
            placeholder='Studijski program'
            fluid
            selection
            options={undefined}
        />
        <Header size='medium'>Studijska grupa</Header>
        <Dropdown
            placeholder='Studijska grupa'
            fluid
            selection
            options={undefined}
        />
        <Header size='medium'>Semestar</Header>
        <Dropdown
            placeholder='Studijska grupa'
            fluid
            selection
            options={undefined}
        />
        <Divider hidden />
        <Header size='small'>Predmet</Header>
        <Dropdown placeholder='Predmet' fluid multiple selection options={undefined} />
        <Header size='small'>Vrsta nastave</Header>
        <Dropdown placeholder='Vrsta nastave' fluid multiple selection options={undefined} />
        <Header size='small'>Grupa</Header>
        <Dropdown placeholder='Grupa' fluid multiple selection options={undefined} />
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
  page: state.menu.page
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => bindActionCreators({
    changePage: viewPage,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters)