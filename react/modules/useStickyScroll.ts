import { useCallback, useLayoutEffect, useState } from 'react'

import { attachListener } from './windowScrollResizeListener'

enum Positions {
  BOTTOM = 'bottom',
  TOP = 'top',
}

interface StickyProps {
  position?: Positions
  verticalSpacing?: number
  offset?: number
  containerHeight: number
  placeholder: HTMLDivElement | null
}

export const useStickyScroll = ({
  position,
  verticalSpacing = 0,
  offset = 0,
  containerHeight,
  placeholder,
}: StickyProps) => {
  const [isStuck, setStuck] = useState<boolean>(false)

  const handlePosition = useCallback(() => {
    if (!placeholder || !containerHeight) {
      return
    }

    const scrollY = window.pageYOffset

    let currentPosition = scrollY
    let stuckPosition = placeholder.offsetTop

    if (position === Positions.TOP) {
      stuckPosition -= offset - verticalSpacing
    } else {
      currentPosition += window.innerHeight
      stuckPosition += offset + verticalSpacing + containerHeight
    }

    const shouldStuck = currentPosition >= stuckPosition

    // same state, do nothing
    if (isStuck === shouldStuck) return

    setStuck(shouldStuck)
  }, [placeholder, position, isStuck, offset, verticalSpacing, containerHeight])

  useLayoutEffect(() => {
    handlePosition()
    return attachListener(handlePosition)
  }, [handlePosition])

  return {
    placeholder,
    isStuck,
  }
}
