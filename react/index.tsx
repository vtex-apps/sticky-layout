import React, { Fragment, FC, useRef, useEffect, useCallback } from 'react'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import { path, head } from 'ramda'

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

const transformPxToInt = (value?: string) => {
  if (!value) {
    return 0
  }
  const isNegative = head(value) === '-'
  const number = parseInt(value.replace(/\D/g, ''), 10)
  return isNegative ? -1 * number : number
}

const StickyLayoutComponent: StorefrontComponent = ({
  children,
  position,
  blockClass,
}) => {
  const container = useRef<HTMLDivElement>(null)
  const startTop = useRef<number | null>(null)
  const hasTouched = useRef<boolean>(false)

  if (position !== Positions.BOTTOM) {
    // Only 'bottom' position supported for now!
    return <Fragment>{children}</Fragment>
  }

  const handleScroll = useCallback((e?: Event) => {
    const target = e && (e.target as HTMLDivElement | null)
    if (!container.current) {
      return
    }
    if (startTop.current == null) {
      startTop.current = container.current.offsetTop
    }

    // We have to get this baseTop variable to handle cases when a modal changes the top style of the base element, resetting the window.pageYOfsset
    const baseTop = transformPxToInt(
      path(['scrollingElement', 'style', 'top'], target)
    )
    const componentTop = startTop.current + baseTop

    const newTop =
      window.innerHeight -
      componentTop -
      container.current.clientHeight +
      window.pageYOffset

    if (newTop < 0) {
      hasTouched.current = true
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
  useEffect(() => {
    if (viewOffset != null && !hasTouched.current) {
      startTop.current = viewOffset
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
