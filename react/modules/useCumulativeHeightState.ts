import { useState } from 'react'

type State = Record<number, number>

const useCumulativeHeightState = () => {
  const [state, set] = useState<State>({})

  const updateRowHeight = ({
    height,
    index,
  }: {
    height: number
    index: number
  }) => {
    if (state[index] === height) {
      return
    }

    set(prev => ({ ...prev, [index]: height }))
  }

  const getAccumulatedHeight = (index: number) => {
    const sortedIndexes = Object.keys(state)
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b)

    const indexes = sortedIndexes.slice(0, sortedIndexes.indexOf(index))
    return indexes.reduce((acc, cur) => (state[cur] || 0) + acc, 0)
  }

  return {
    getAccumulatedHeight,
    updateRowHeight,
  }
}

export default useCumulativeHeightState
