import { FC, useEffect, useRef } from 'react'
import { useRect } from '@lib/hooks/useRect'
import { useStudio } from '@components/studio/context'
import { drawBaseLayer } from '@lib/animation-generator'
import { SnapshotType } from '@components/studio/types'

interface Props {
  className?: string
}

const BaseLayer: FC<Props> = ({ className }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const { width, height } = useRect(ref)

  const { snapshots } = useStudio()

  useEffect(() => {
    if (!ref.current) return

    drawBaseLayer(
      ref?.current,
      snapshots.map((s: SnapshotType) => s[1])
    )
  }, [ref, snapshots])

  return (
    <canvas ref={ref} width={width} height={height} className={className} />
  )
}

export { BaseLayer }
