import { useCallback, useState } from 'react'

import { useWindowListener } from './useWindowListener'
import { Positions } from '../types'

interface StickyProps {
  position?: Positions
  verticalSpacing?: number
  stickOffset?: number
  contentHeight: number | string
  wrapperOffsetTop: number | undefined
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
      if (!contentHeight || typeof contentHeight !== 'number' || wrapperOffsetTop === undefined) return

      const offset = stickOffset + verticalSpacing
      let currentPosition = scrollY
      let stuckPosition = wrapperOffsetTop

      if (position === Positions.TOP) {
        stuckPosition -= offset
        /*
         * We remove `1` from the current position because stuck elements at the top
         * of the page must be able to be considered "unstuck".
         * In example, a mobile header at the top of the page should be considered unstuck
         * if the user scrolls back to the top of the page.
         */
        if (stuckPosition === 0 && currentPosition === 0) {
          currentPosition -= 1
        }
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
