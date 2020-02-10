// Adapted from https://github.com/lencioni/consolidated-events/blob/master/src/canUsePassiveEventListeners.js
function testPassiveEventListeners() {
  if (typeof window === 'undefined') {
    return false
  }

  let supportsPassiveOption = false
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassiveOption = true
      },
    })
    const noop = () => {}
    window.addEventListener('testPassiveEventSupport', noop, opts)
    window.removeEventListener('testPassiveEventSupport', noop, opts)
  } catch (e) {
    // do nothing
  }

  return supportsPassiveOption
}

let memoizedResult: boolean

export default function canUsePassiveEventListeners() {
  if (memoizedResult === undefined) {
    memoizedResult = testPassiveEventListeners()
  }
  return memoizedResult
}
