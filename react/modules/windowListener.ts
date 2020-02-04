import throttle from 'throttleit'

const events: Record<string, Set<Function>> = {}

interface EventDelegator extends EventListenerObject {
  [key: string]: Function
}

const eventDelegator: EventDelegator = {
  handleEvent: (e: Event) => {
    let handlerName = 'defaultHandler'

    if (handlerName in eventDelegator) {
      handlerName = `${e.type}Handler`
    }

    eventDelegator[handlerName](e)
  },
  scrollHandler: throttle((e: Event) => {
    const scrollY = window.pageYOffset
    events[e.type].forEach(fn => fn(scrollY))
  }, 50),
  resizeHandler: throttle((e: Event) => {
    const scrollY = window.pageYOffset
    events[e.type].forEach(fn => fn(scrollY))
  }, 50),
  defaultHandler(e: Event) {
    events[e.type].forEach(fn => fn(e))
  },
}

function detachListener(eventList: string[], fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  eventList.forEach(event => {
    events[event].delete(fn)
    if (events[event].size === 0) {
      window.removeEventListener(event, eventDelegator)
    }
  })
}

export function attachListener(eventList: string[], fn: Function) {
  if (typeof window === 'undefined') {
    return
  }

  eventList.forEach(event => {
    if (!(event in events)) events[event] = new Set()
    if (events[event].size === 0) {
      window.addEventListener(event, eventDelegator)
    }
    events[event].add(fn)
  })

  return () => detachListener(eventList, fn)
}
