import React from 'react'
import { Menu } from 'antd'
import { Link, LinkProps } from 'react-router-dom'
import { MenuProps } from 'antd/lib/menu/index.d'
import { MenuItemProps } from 'antd/lib/menu/MenuItem'
import { get } from 'lodash'

export interface BaseMenuProps {
  menuConfig: BaseMenuConfig[]
  menuProps?: MenuProps
}

export interface BaseMenuConfig {
  path: string
  title: React.ReactNode
  linkProps?: Omit<LinkProps, 'to' | 'title'>
  menuItemProps?: MenuItemProps
  children?: BaseMenuConfig[]
  id?: number
  isSubMenu?: Boolean
  redirect?: string
}

const { SubMenu, Item } = Menu

const generateMenuItem = ({
  linkProps,
  menuItemProps,
  redirect,
  children,
  ...otherProps
}: BaseMenuConfig) => {
  return Array.isArray(children) && Array.isArray(children) ? (
    <SubMenu
      key={otherProps.path}
      title={otherProps.title}
      icon={get(otherProps, 'menuItemProps.icon')}
    >
      {children.map((v) => generateMenuItem(v))}
    </SubMenu>
  ) : (
    <Item key={otherProps.path} {...menuItemProps}>
      {!redirect ? (
        <Link
          {...{
            to: otherProps.path,
            rel: 'noopener noreferrer',
            ...linkProps,
          }}
        >
          {otherProps.title}
        </Link>
      ) : (
        <a href={redirect} target="_self" {...linkProps}>
          {otherProps.title}
        </a>
      )}
    </Item>
  )
}

const BaseMenu: React.FunctionComponent<BaseMenuProps> = ({
  menuConfig,
  menuProps,
}) => {
  return (
    <Menu {...menuProps}>
      {menuConfig.map(({ children, ...otherProps }) =>
        !children ? (
          generateMenuItem(otherProps)
        ) : (
          <SubMenu
            key={otherProps.path}
            title={otherProps.title}
            icon={get(otherProps, 'menuItemProps.icon')}
          >
            {children.map((v) => generateMenuItem(v))}
          </SubMenu>
        ),
      )}
    </Menu>
  )
}

export default BaseMenu
