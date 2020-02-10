import { useCallback, useState } from 'react'

import { useWindowListener } from './useWindowListener'
import { Positions } from '../typings'

interface StickyProps {
  position?: Positions
  verticalSpacing?: number
  stickOffset?: number
  contentHeight: number
  wrapperOffsetTop: number
}

/*
 * Hook responsible for defining if a sticky element should stuck to the viewport or not
 *
 * @param {StickyProps} {
 *   position,
 *   verticalSpacing = 0,
 *   stickOffset = 0,
 *   contentHeight,
 *   wrapperOffsetTop,
 * }
 * @returns { isStuck }
 */
export const useStickyScroll = ({
  position,
  verticalSpacing = 0,
  stickOffset = 0,
  contentHeight,
  wrapperOffsetTop,
}: StickyProps) => {
  const [isStuck, setStuck] = useState<boolean>(false)

  const handlePosition = useCallback(
    (scrollY: number) => {
      if (!contentHeight) return

      const offset = stickOffset + verticalSpacing
      let currentPosition = scrollY
      let stuckPosition = wrapperOffsetTop

      if (position === Positions.TOP) {
        stuckPosition -= offset
      } else {
        currentPosition += window.innerHeight
        stuckPosition += offset + contentHeight
      }

      const shouldStick = currentPosition >= stuckPosition

      // same state, do nothing
      if (isStuck === shouldStick) return

      setStuck(shouldStick)
    },
    [
      contentHeight,
      wrapperOffsetTop,
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
