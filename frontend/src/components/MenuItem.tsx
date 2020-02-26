import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'

export interface MenuItemProps {
  name: string,
  icon: SemanticICONS,
  active: boolean,
  handleClick: any
}

const MenuItem: React.FC<MenuItemProps> = ({name, icon, active, handleClick}) => {
  return (
    <Menu.Item
      name={name}
      active={active}
      onClick={handleClick}
    >
      <Icon name={icon}/>
      {name}
    </Menu.Item>
  )
}

export default MenuItem