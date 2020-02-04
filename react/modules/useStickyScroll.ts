import { useCallback, useState } from 'react'

import { useWindowListener } from './useWindowListener'
import { Positions } from '../typings'

interface StickyProps {
  position?: Positions
  verticalSpacing?: number
  stickOffset?: number
  contentHeight: number
  placeholderOffsetTop: number
}

export const useStickyScroll = ({
  position,
  verticalSpacing = 0,
  stickOffset = 0,
  contentHeight,
  placeholderOffsetTop,
}: StickyProps) => {
  const [isStuck, setStuck] = useState<boolean>(false)

  const handlePosition = useCallback(
    (scrollY: number) => {
      if (!contentHeight) return

      let currentPosition = scrollY
      let stuckPosition = placeholderOffsetTop

      if (position === Positions.TOP) {
        stuckPosition -= stickOffset - verticalSpacing
      } else {
        currentPosition += window.innerHeight
        stuckPosition += stickOffset + verticalSpacing + contentHeight
      }

      const shouldStuck = currentPosition >= stuckPosition

      // same state, do nothing
      if (isStuck === shouldStuck) return

      setStuck(shouldStuck)
    },
    [
      contentHeight,
      placeholderOffsetTop,
      position,
      isStuck,
      stickOffset,
      verticalSpacing,
    ]
  )

  useWindowListener(['resize', 'scroll'], handlePosition)

  return {
    isStuck,
  }
}
