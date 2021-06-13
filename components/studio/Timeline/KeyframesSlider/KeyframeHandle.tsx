import { FC, useEffect, useMemo, useRef } from 'react'
import { GetHandleProps, SliderItem } from 'react-compound-slider'
import s from './KeyframesSlider.module.css'
import cn from 'classnames'
import { useStudio } from '@components/studio/context'
import { SnapshotType } from '@components/studio/types'

interface HandleProps {
  domain: number[]
  handle: SliderItem
  getHandleProps: GetHandleProps
  disabled?: boolean
  className?: string
}

const WIDTH = 80
const HEIGHT = 60

export const KeyframeHandle: FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
  className = s.handle,
}) => {
  const canvasRef = useRef(null)
  const { snapshots, setCurrentFrame, deleteKeyframe } = useStudio()

  useEffect(() => {
    const snapshot = snapshots.find(
      (snapshot: SnapshotType) => snapshot[0] === value
    )

    if (!snapshot?.[1]?.width || !snapshot?.[1]?.height || !canvasRef) return

    //@ts-ignore
    const context = canvasRef.current?.getContext('2d')
    context.drawImage(snapshot[1], 0, 0, WIDTH, HEIGHT)
  }, [canvasRef, snapshots, value])

  return (
    <div
      className={s.handleContainer}
      style={{
        left: `${percent}%`,
      }}
      {...getHandleProps(id)}
    >
      <button
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(className, { [s.disabled]: disabled })}
        onPointerDown={() => setCurrentFrame(value)}
      />
      <canvas
        ref={canvasRef}
        className={s.canvas}
        width={WIDTH}
        height={HEIGHT}
        onPointerDown={() => deleteKeyframe(value)}
      />
    </div>
  )
}
