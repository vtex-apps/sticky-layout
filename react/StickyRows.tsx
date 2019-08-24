import React, { FunctionComponent } from 'react'
import useCumulativeHeightState from './hooks/useCumulativeHeightState'
import StickyRow from './StickyRow'

interface Props {
  position: string
}

const RowContext = React.createContext<{
  onResize(height: number): void
  offset: number
}>({
  onResize: () => {},
  offset: 0,
})

const StickyRows: FunctionComponent<Props> = ({ children, position }) => {
  const { updateRowHeight, getAccumulatedHeight } = useCumulativeHeightState()

  return (
    <React.Fragment>
      {React.Children.map(children, (child, index) => (
        <RowContext.Provider
          value={{
            onResize: (height: number) => updateRowHeight({ height, index }),
            offset: getAccumulatedHeight(index),
          }}
        >
          {position ? (
            <StickyRow placement={position} sticky>
              {child}
            </StickyRow>
          ) : (
            child
          )}
        </RowContext.Provider>
      ))}
    </React.Fragment>
  )
}

export default StickyRows
export { RowContext }
