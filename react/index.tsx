import React, { Fragment, FC, useEffect } from 'react'
import { path } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import { useStickyScroll } from './useStickyScroll'

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
  const {
    containerReference,
    container,
    handlePosition,
    debouncedHandlePosition
  } = useStickyScroll({ position, verticalSpacing })

  useEffect(() => {
    window && window.addEventListener('scroll', debouncedHandlePosition)
    window && window.addEventListener('resize', handlePosition)
    return () => {
      window && window.removeEventListener('scroll', debouncedHandlePosition)
      window && window.removeEventListener('resize', handlePosition)
    }
  }, [handlePosition])

  const viewOffset = path<number>(['current', 'offsetTop'], containerReference)
  // This effect places the button at the right position while the screen is mounting
  useEffect(() => {
    if (viewOffset != null) {
      handlePosition()
    }
  }, [handlePosition, viewOffset])

  if (!position || (position !== Positions.BOTTOM && position !== Positions.TOP)) {
    return <Fragment>{children}</Fragment>
  }

  return (
    <Fragment>
      <div ref={containerReference}></div>
      <div
        ref={container}
        className={handles.container}
        style={{
          position: 'relative',
          bottom: 0,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent
