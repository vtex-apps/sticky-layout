import React, {
  Fragment,
  FC,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { useStickyScroll } from './modules/useStickyScroll'
import { StackContext } from './StackContainer'
import { Positions } from './typings'
import { useWindowListener } from './modules/useWindowListener'

const CSS_HANDLES = ['container', 'placeholder'] as const

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

  const placeholderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Height of the sticky layout content
  const [contentHeight, setContentHeight] = useState<number>(0)
  // Distance of the sticky layout placeholder to the top of the page
  const [placeholderOffsetTop, setPlaceholderOffsetTop] = useState<number>(0)

  const { stickOffset, onResize, position: positionContext } = useContext(
    StackContext
  )

  // Capturing the `placeholder.offsetTop` is costly, triggering
  // the layer tree update, paint and composite steps.
  // To solve this, we use the DOMContentLoaded together with a setInterval
  // to regularly update this value instead of reading it on EVERY scroll handler.
  const updatePlaceholderOffset = useCallback(() => {
    const offsetTop = placeholderRef.current?.offsetTop ?? 0
    if (offsetTop !== placeholderOffsetTop) {
      setPlaceholderOffsetTop(offsetTop)
    }
  }, [placeholderOffsetTop])

  // update the placeholder offset regularlay
  useLayoutEffect(() => {
    const intervalID = setInterval(updatePlaceholderOffset)
    return () => clearInterval(intervalID)
  }, [updatePlaceholderOffset])

  // update the placeholder offset when DOM parsing is done
  useWindowListener(['DOMContentLoaded'], updatePlaceholderOffset)

  // Context position prop precedes the StickyLayout position prop
  const position = positionContext ?? positionProp ?? Positions.TOP

  const { isStuck } = useStickyScroll({
    stickOffset,
    position,
    verticalSpacing,
    contentHeight,
    placeholderOffsetTop,
  })

  if (positionContext != null && positionProp != null) {
    console.warn(
      '"StackContainer" overrides the "StickyLayout" "position" prop.'
    )
  }

  const containerClassname = [
    isStuck ? applyModifiers(handles.container, ['stuck']) : handles.container,
    !zIndex && 'z-999',
    isStuck ? 'fixed' : 'relative',
    'w-100',
  ]
    .filter(Boolean)
    .join(' ')

  const containerStyle = {
    [position]: isStuck ? verticalSpacing + stickOffset : 0,
    zIndex,
  }

  const placeholderStyle = {
    height: isStuck ? contentHeight : 0,
  }

  return (
    <Fragment>
      <div
        ref={placeholderRef}
        className={`${handles.placeholder}`}
        style={placeholderStyle}
      />
      <div
        ref={containerRef}
        className={containerClassname}
        style={containerStyle}
      >
        {children}
        <ReactResizeDetector
          handleHeight
          onResize={(_, height) => {
            setContentHeight(height)
            onResize(height)
          }}
        />
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent
