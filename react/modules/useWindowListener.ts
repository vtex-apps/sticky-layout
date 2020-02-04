import { useLayoutEffect } from 'react'
import throttle from 'throttleit'

const currentEvents: Record<string, Set<Function>> = {}

const throttledScrollResizeHandler = throttle((e: Event) => {
  const scrollY = window.pageYOffset
  currentEvents[e.type].forEach(fn => fn(scrollY))
}, 50)

const handlers: Record<string, (e: Event) => void> = {
  scroll: throttledScrollResizeHandler,
  resize: throttledScrollResizeHandler,
  default: (e: Event) => {
    currentEvents[e.type].forEach(fn => fn(e))
  },
}

function getHandler(event: string): (e: Event) => void {
  return handlers[event] ?? handlers.default
}

function detachListener(eventList: string[], fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  eventList.forEach(event => {
    currentEvents[event].delete(fn)
    if (currentEvents[event].size === 0) {
      window.removeEventListener(event, getHandler(event))
    }
  })
}

function attachListener(eventList: string[], fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  eventList.forEach(event => {
    if (!(event in currentEvents)) currentEvents[event] = new Set()
    if (currentEvents[event].size === 0) {
      window.addEventListener(event, getHandler(event))
    }
    currentEvents[event].add(fn)
  })

  return () => detachListener(eventList, fn)
}

export function useWindowListener(eventList: string[], fn: Function) {
  useLayoutEffect(() => attachListener(eventList, fn), [eventList, fn])
}
