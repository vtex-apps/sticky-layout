import React, {
  FC,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  CSSProperties,
} from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { useStickyScroll } from './modules/useStickyScroll'
import { StackContext } from './StackContainer'
import { Positions } from './types'
import { useWindowListener } from './modules/useWindowListener'

const CSS_HANDLES = ['container', 'wrapper'] as const

interface Props {
  position?: Positions
  verticalSpacing?: number
  zIndex?: number
}

const StickyLayoutComponent: FC<Props> = ({
  children,
  position: positionProp,
  zIndex,
  verticalSpacing = 0,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Height of the sticky layout content
  const [contentHeight, setContentHeight] = useState<number | string>('auto')
  // Distance of the sticky layout wrapper to the top of the page
  const [wrapperOffsetTop, setWrapperOffsetTop] = useState<number>(0)

  const { stickOffset, onResize, position: positionContext } = useContext(
    StackContext
  )

  // Capturing the `wrapper.offsetTop` is costly, triggering
  // the layer tree update, paint and composite steps.
  // To solve this, we use the DOMContentLoaded together with a setInterval
  // to regularly update this value instead of reading it on EVERY scroll handler.
  const updateWrapperOffset = useCallback(() => {
    const offsetTop = wrapperRef.current?.offsetTop ?? 0
    if (offsetTop !== wrapperOffsetTop) {
      setWrapperOffsetTop(offsetTop)
    }
  }, [wrapperOffsetTop])

  // update the wrapper offset regularly because the page structure may have changed
  useLayoutEffect(() => {
    const intervalID = setInterval(updateWrapperOffset, 3000)
    return () => clearInterval(intervalID)
  }, [updateWrapperOffset])

  // update the wrapper offset when DOM parsing is done
  useWindowListener(['DOMContentLoaded', 'resize'], updateWrapperOffset)

  // Context position prop precedes the StickyLayout position prop
  const position = positionContext ?? positionProp ?? Positions.TOP

  const { isStuck } = useStickyScroll({
    stickOffset,
    position,
    verticalSpacing,
    contentHeight,
    wrapperOffsetTop,
  })

  if (positionContext != null && positionProp != null) {
    console.warn(
      '"StackContainer" overrides the "StickyLayout" "position" prop.'
    )
  }

  const containerClassname = [
    handles.container,
    !zIndex && 'z-999',
    isStuck ? 'fixed' : 'relative',
    'left-0 right-0',
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperClassname = isStuck
    ? applyModifiers(handles.wrapper, ['stuck'])
    : handles.wrapper

  const containerStyle: CSSProperties = {
    [position]: isStuck ? verticalSpacing + stickOffset : 0,
    zIndex,
  }

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    height: contentHeight,
  }

  return (
    <div ref={wrapperRef} className={wrapperClassname} style={wrapperStyle}>
      <div
        ref={containerRef}
        className={containerClassname}
        style={containerStyle}
      >
        {children}
        <ReactResizeDetector
          handleHeight
          onResize={(_, height) => {
            if (isStuck === false) {
              setContentHeight(height)
            }
            onResize(height)
          }}
        />
      </div>
    </div>
  )
}

export default StickyLayoutComponent
