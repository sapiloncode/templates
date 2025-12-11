import { KeyboardEvent, MouseEvent, useEffect } from 'react'

type EventTypeMap = {
  visibilitychange: Event
  touchmove: TouchEvent
  keydown: KeyboardEvent
  keyup: KeyboardEvent
  mousedown: MouseEvent
  mouseup: MouseEvent
  mousemove: MouseEvent
}

type DocumentEvents = keyof EventTypeMap

export const useDocumentEvent = <K extends DocumentEvents>(
  type: K,
  handler: (event: EventTypeMap[K]) => void,
  options?: AddEventListenerOptions
) =>
  useEffect(() => {
    const listener = (event: Event) => handler(event as EventTypeMap[K])
    document.addEventListener(type, listener, options)
    return () => {
      document.removeEventListener(type, listener)
    }
  }, [type, handler, options])
