import { useEffect, useCallback, RefObject } from 'react'
import { path } from 'ramda'

export enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

function resolveNewTop(
  position: Positions,
  container: RefObject<HTMLDivElement>,
  componentTop: number
) {
  if (position === Positions.TOP)
    return componentTop > window.pageYOffset
      ? 0
      : -(componentTop - window.pageYOffset)

  const clientHeight = path<number>(['current', 'clientHeight'], container) || 0

  return window.innerHeight - componentTop - clientHeight + window.pageYOffset
}

export const useScroll = (
  container: RefObject<HTMLDivElement>,
  position: Positions
) => {
  const handleScroll = useCallback(
    (e?: Event) => {
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

      const newTop = resolveNewTop(position, container, componentTop)

      if (newTop < 0 || position === Positions.TOP) {
        container.current.style.transform = `translate3d(0, ${newTop}px, 0)`
        return
      }
      if (newTop >= 0) {
        // Reset and don't change anything
        container.current.style.transform = `translate3d(0, 0px, 0)`
      }
    },
    [container, position]
  )

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
}
