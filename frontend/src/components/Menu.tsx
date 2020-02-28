import React from 'react'
import { ApplicationState } from '../store'
import { Menu as MenuSemantic } from 'semantic-ui-react'
import { PageName } from '../store/menu/types'
import { viewPage } from '../store/menu/actions'
import { useSelector, useDispatch } from 'react-redux'
import MenuItem from './MenuItem'
import '../style/Menu.css'

type MenuProps = {}

export const Menu: React.FC<MenuProps> = () => {

  const page = useSelector((state: ApplicationState) => state.menu.page)
  const dispatch = useDispatch()

  return (
    <MenuSemantic fluid widths={3} primary='true' size='large'>
      <MenuItem 
        name='Raspored'
        icon={'calendar alternate'}
        active={page === PageName.TIMETABLE}
        handleClick={() => dispatch(viewPage(PageName.TIMETABLE))}
      />
      <MenuItem 
        name='Filteri' 
        icon={'filter'} 
        active={page === PageName.FILTERS}
        handleClick={() => dispatch(viewPage(PageName.FILTERS))}
      />
      <MenuItem
        name='Postavke'
        icon={'cog'}
        active={page === PageName.PREFERENCES}
        handleClick={() => dispatch(viewPage(PageName.PREFERENCES))}
      />
    </MenuSemantic>
  )
}

export default Menu