import { FC, useRef } from 'react'

const BaseLayer: FC = () => {
  const ref = useRef(null)

  return <canvas ref={ref} />
}

export { BaseLayer }
