import React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { ApplicationState } from '../store'
import { Menu as MenuSemantic } from 'semantic-ui-react'
import { PageName } from '../store/menu/types'
import { viewPage } from '../store/menu/actions'
import { connect } from 'react-redux'
import { Action } from 'typesafe-actions'
import MenuItem from './MenuItem'
import '../style/Menu.css'

type MenuProps = 
ReturnType<typeof mapStateToProps> &
ReturnType<typeof mapDispatchToProps> & {
  page: PageName
}

export const Menu: React.FC<MenuProps> = ({page, changePage}) => {
  return (
    <MenuSemantic fluid widths={3} primary='true' size='large'>
      <MenuItem 
        name='Raspored'
        icon={'calendar alternate'}
        active={page === PageName.TIMETABLE}
        handleClick={() => changePage(PageName.TIMETABLE)}
      />
      <MenuItem 
        name='Filteri' 
        icon={'filter'} 
        active={page === PageName.FILTERS}
        handleClick={() => changePage(PageName.FILTERS)}
      />
      <MenuItem
        name='Postavke'
        icon={'cog'}
        active={page === PageName.PREFERENCES}
        handleClick={() => changePage(PageName.PREFERENCES)}
      />
    </MenuSemantic>
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
)(Menu)