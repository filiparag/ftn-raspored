import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { PageName } from '../store/menu/types'
import { viewPage } from '../store/menu/actions'
import { connect } from 'react-redux'
import { Action } from 'typesafe-actions'
import { Header, Dropdown, Divider, Button, Segment } from 'semantic-ui-react'

type PreferencesProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps> & {
  page: PageName
}

export const Preferences: React.FC<PreferencesProps> = ({page, changePage}) => {
  return (
    <div>
      <Header size='huge'>Postavke</Header>
      <Segment color='green' padded>
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
        <Button fluid color='green'>Sačuvaj</Button>
      </Segment>
      <Segment color='grey' padded>
        <Header size='medium'>O servisu</Header>
        <Divider hidden />
        Verzija: devel
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
)(Preferences)