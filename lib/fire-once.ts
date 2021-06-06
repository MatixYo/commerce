import { SyntheticEvent } from 'react'

export async function fireOnce(
  target: EventTarget,
  type: string
): Promise<EventTarget> {
  return new Promise((resolve) => {
    target.addEventListener(type, function fn() {
      target.removeEventListener(type, fn)
      resolve(this)
    })
  })
}
