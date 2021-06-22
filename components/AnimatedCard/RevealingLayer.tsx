import { FC, useEffect, useRef } from 'react'
import { useRect } from '@lib/hooks/useRect'
import { useStudio } from '@components/studio/context'
import { drawRevealingLayer } from '@lib/animation-generator'

interface Props {
  className?: string
}

const RevealingLayer: FC<Props> = ({ className }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const { width, height } = useRect(ref)

  const { keyframes } = useStudio()

  useEffect(() => {
    if (!ref.current || keyframes.length < 2) return

    drawRevealingLayer(ref?.current, keyframes.length)
  }, [ref, keyframes])

  return <canvas ref={ref} width={1200} height={800} className={className} />
}

export { RevealingLayer }
