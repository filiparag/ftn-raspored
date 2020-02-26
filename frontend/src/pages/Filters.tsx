import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { PageName } from '../store/menu/types'
import { viewPage } from '../store/menu/actions'
import { connect } from 'react-redux'
import { Action } from 'typesafe-actions'
import { Header, Dropdown, Divider, Button, Segment } from 'semantic-ui-react'

type FiltersProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps> & {
  page: PageName
}

export const Filters: React.FC<FiltersProps> = ({page, changePage}) => {
  return (
    <div>
      <Header size='huge'>Filteri</Header>
      <Segment color='blue' raised padded>
        <Header size='medium'>Uputstvo</Header>
        <p>
          Filteri služe za prilagođavanje rasporeda pojedinačnim potrebama.
          Svaki filter čini presek pojedinačnih pravila.
        </p>
        <Button fluid color='blue'>U redu</Button>
      </Segment>
      <Segment color='green' padded>
        <Header size='medium'>Novi filter</Header>
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