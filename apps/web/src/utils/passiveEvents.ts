
export const addPassiveEventListener = (
  element: Element | Window,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) => {
  element.addEventListener(event, handler, {
    passive: true,
    ...options
  })
}

export const removePassiveEventListener = (
  element: Element | Window,
  event: string,
  handler: EventListener
) => {
  element.removeEventListener(event, handler)
}
