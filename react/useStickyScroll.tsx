import { useCallback, useRef } from 'react'
import debounce from 'debounce'

enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

interface StickyProps {
  position?: Positions
  verticalSpacing?: number
}

const SMOOTH_SCROLL_TIME = 10

export const useStickyScroll = ({ position, verticalSpacing }: StickyProps) => {
  const containerReference = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

  const handlePosition = useCallback(() => {
    if (!containerReference.current || !container.current) {
      return
    }

    let stickyPosition = 0
    let containerReferencePosition =
      containerReference.current &&
      containerReference.current.offsetTop

    if (position === Positions.BOTTOM) {
      containerReferencePosition += container.current.clientHeight
      stickyPosition = window.pageYOffset + window.innerHeight
    } else if (position === Positions.TOP) {
      stickyPosition = window.pageYOffset
    }

    if (verticalSpacing) {
      if (position === Positions.BOTTOM) {
        stickyPosition -= verticalSpacing
      }
      if (position === Positions.TOP) {
        stickyPosition += verticalSpacing
      }
    }

    if (stickyPosition >= containerReferencePosition) {
      container.current.style.position = 'relative'
      container.current.style.marginBottom = ''
      container.current.style.marginTop = ''
      containerReference.current.style.height = ''
    } else {
      if (position === Positions.BOTTOM) {
        container.current.style.marginBottom = `${verticalSpacing}px`
      } else if (position === Positions.TOP) {
        container.current.style.marginTop = `${verticalSpacing}px`
      }

      // In order to avoid the blocking effect that setting the `position: fixed` gives
      // we created a placeholder component which receives is height therefore mantaining
      // smooth scrolling.
      containerReference.current.style.height = `${container.current.clientHeight}px`

      container.current.style.position = 'fixed'

      // In order to mantain the component's width when the position is fixed,
      // we get the width of the container and set to the width of the sticky layout.
      if (container.current.parentElement) {
        container.current.style.width = `${container.current.parentElement.clientWidth}px`
      }
    }
  }, [])

  const debouncedHandlePosition = debounce(handlePosition, SMOOTH_SCROLL_TIME)

  return {
    container,
    containerReference,
    handlePosition,
    debouncedHandlePosition,
  }
}