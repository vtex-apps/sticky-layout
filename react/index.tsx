import React, { FC } from 'react'
import { BlockClass } from '@vtex/css-handles'
import StickyRows from './StickyRows'

enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

interface Props {
  position: Positions
}

interface StorefrontComponent extends FC<Props & BlockClass> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({ children, position }) => {
  return <StickyRows position={position}>{children}</StickyRows>
}

export default StickyLayoutComponent
