import React, { Fragment, FC, useContext, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { useCssHandles } from 'vtex.css-handles'

import { useStickyScroll } from './modules/useStickyScroll'
import { StackContext } from './StackContainer'
import { Positions } from './typings'
import { useNodeRef } from './modules/useNodeRef'

const CSS_HANDLES = ['container'] as const

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
  const [placeholder, placeholderRef] = useNodeRef<HTMLDivElement>()
  const [container, containerRef] = useNodeRef<HTMLDivElement>()
  const handles = useCssHandles(CSS_HANDLES)
  const [containerHeight, setContainerHeight] = useState<number>(0)
  const { offset, onResize, position: positionContext } = useContext(
    StackContext
  )

  const position = positionContext ?? positionProp ?? Positions.TOP

  const { isStuck } = useStickyScroll({
    offset,
    position,
    verticalSpacing,
    containerHeight,
    placeholder,
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
    'w-100',
  ]
    .filter(Boolean)
    .join(' ')

  const containerStyle = {
    [position]: isStuck ? verticalSpacing + offset : 0,
    zIndex,
  }

  const placeholderStyle = {
    height: isStuck ? container?.clientHeight : 0,
  }

  return (
    <Fragment>
      <div ref={placeholderRef} style={placeholderStyle} />
      <div
        ref={containerRef}
        className={containerClassname}
        style={containerStyle}
      >
        {children}
        <ReactResizeDetector
          handleHeight
          onResize={(_, height) => {
            setContainerHeight(height)
            onResize(height)
          }}
        />
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent
