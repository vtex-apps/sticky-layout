import React, { Fragment, FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import styles from './styles.css'
const CSS_HANDLES = ['container'] as const

enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

interface Props {
  position?: Positions
  verticalSpacing?: number
}

interface StorefrontComponent extends FC<Props> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({ children, position, verticalSpacing = 0 }) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (!position || (position !== Positions.BOTTOM && position !== Positions.TOP)) {
    return <Fragment>{children}</Fragment>
  }

  return (
    <Fragment>
      <div
        className={`${handles.container} ${styles.sticky}`}
        style={{
          ...(position === Positions.TOP ? { top: verticalSpacing } : {}),
          ...(position === Positions.BOTTOM ? { bottom: verticalSpacing } : {}),
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent
