import throttle from 'throttleit'

const listeners = new Set<Function>()

const handler = throttle(() => {
  const scrollY = window.pageYOffset
  listeners.forEach(fn => fn(scrollY))
}, 50)

function detachListener(fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  listeners.delete(fn)

  if (listeners.size > 0) {
    return
  }

  window.removeEventListener('resize', handler)
  window.removeEventListener('scroll', handler)
}

export function attachListener(fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  if (listeners.size === 0) {
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler)
  }

  listeners.add(fn)
  return () => detachListener(fn)
}
