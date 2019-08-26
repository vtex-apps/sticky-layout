import React, { FC, useRef } from 'react'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import { useScroll, Positions } from './hooks/useScroll'

import styles from './styles.css'

interface Props {
  position: Positions
  zIndex?: number
}

interface StorefrontComponent extends FC<Props & BlockClass> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({
  children,
  position,
  blockClass,
  zIndex,
}) => {
  const container = useRef<HTMLDivElement>(null)

  useScroll(container, position)

  return (
    <div
      ref={container}
      className={generateBlockClass(styles.container, blockClass)}
      style={{
        position: 'relative',
        bottom: position === Positions.BOTTOM ? 0 : undefined,
        top: position === Positions.TOP ? 0 : undefined,
        zIndex: zIndex || 999,
      }}
    >
      {children}
    </div>
  )
}

export default StickyLayoutComponent
