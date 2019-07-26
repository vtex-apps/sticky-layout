import React, { Fragment, FC, useRef, useEffect, useCallback } from 'react'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import { path } from 'ramda'

import styles from './styles.css'

enum Positions {
  BOTTOM = 'bottom',
}

interface Props {
  position?: Positions
}

interface StorefrontComponent extends FC<Props & BlockClass> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({
  children,
  position,
  blockClass,
}) => {
  const container = useRef<HTMLDivElement>(null)

  if (position !== Positions.BOTTOM) {
    // Only 'bottom' position supported for now!
    return <Fragment>{children}</Fragment>
  }

  const handleScroll = useCallback((e?: Event) => {
    const target = (e && e.target) as HTMLDivElement | null
    if (!container.current) {
      return
    }

    // We have to get this baseTop variable to handle cases when a modal changes the top style of the base element, resetting the window.pageYOfsset
    const baseTop = parseInt(
      path(['scrollingElement', 'style', 'top'], target) || '0',
      10
    )
    const componentTop = container.current.offsetTop + baseTop

    const newTop =
      window.innerHeight -
      componentTop -
      container.current.clientHeight +
      window.pageYOffset

    if (newTop < 0) {
      container.current.style.transform = `translate3d(0, ${newTop}px, 0)`
      return
    }
    if (newTop >= 0) {
      // Reset and don't change anything
      container.current.style.transform = `translate3d(0, 0px, 0)`
    }
  }, [])

  useEffect(() => {
    window && window.addEventListener('scroll', handleScroll)
    return () => {
      window && window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])
  const viewOffset = path<number>(['current', 'offsetTop'], container)
  // This effect places the button at the right position while the screen is mounting
  useEffect(() => {
    if (viewOffset != null) {
      handleScroll()
    }
  }, [handleScroll, viewOffset])

  return (
    <div
      ref={container}
      className={generateBlockClass(styles.container, blockClass)}
      style={{
        position: 'relative',
        bottom: 0,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  )
}

export default StickyLayoutComponent
