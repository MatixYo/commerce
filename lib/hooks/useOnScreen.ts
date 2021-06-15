import { useState, useEffect } from 'react'

//from https://github.com/vercel/swr/blob/master/examples/infinite-scroll/hooks/useOnScreen.js
export const useOnScreen = (ref: { current: Element }) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}
