import React, { FC, createContext } from 'react'

import useCumulativeHeightState from './modules/useCumulativeHeightState'
import { Positions } from './types'

interface StackContext {
  position?: Positions
  onResize(height: number): void
  stickOffset: number
}

interface Props {
  position: Positions
}

export const StackContext = createContext<StackContext>({
  onResize: () => {},
  stickOffset: 0,
})

/** This component is used to accumulate the height of multiple StickLayout blocks,
 * so that they get stacked instead of appearing in front of each other */
const StackContainer: FC<Props> = ({ children, position = Positions.TOP }) => {
  const { updateRowHeight, getAccumulatedHeight } = useCumulativeHeightState()

  return (
    <React.Fragment>
      {React.Children.map(children, (child, index) => (
        <StackContext.Provider
          value={{
            position,
            onResize: (height: number) => updateRowHeight({ height, index }),
            stickOffset: getAccumulatedHeight(index),
          }}
        >
          {child}
        </StackContext.Provider>
      ))}
    </React.Fragment>
  )
}

export default StackContainer
