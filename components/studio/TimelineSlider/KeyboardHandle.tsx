import { FC, useEffect, useRef } from 'react'
import { GetHandleProps, SliderItem } from 'react-compound-slider'
import s from './TimelineSlider.module.css'
import cn from 'classnames'
import { useStudio } from '@components/studio/context'
import { KeyframeType } from '@components/studio/types'

interface HandleProps {
  domain: number[]
  handle: SliderItem
  getHandleProps: GetHandleProps
  disabled?: boolean
  className?: string
}

const WIDTH = 80
const HEIGHT = 60

export const KeyboardHandle: FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
  className = s.handle,
}) => {
  const canvasRef = useRef(null)
  const { keyframes } = useStudio()

  useEffect(() => {
    if (!keyframes || !canvasRef) return

    const keyframe = keyframes.find(
      (keyframe: KeyframeType) => keyframe.frameNumber === value
    )

    if (!keyframe?.canvas?.width || !keyframe?.canvas?.height) return

    const context = canvasRef.current?.getContext('2d')
    console.log('really redrawing', keyframe)
    context.drawImage(keyframe.canvas, 0, 0, WIDTH, HEIGHT)
  }, [keyframes, canvasRef, value])

  return (
    <>
      <button
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
        }}
        className={cn(className, { [s.disabled]: disabled })}
        {...getHandleProps(id)}
      />
      <canvas
        ref={canvasRef}
        className={s.canvas}
        style={{
          left: `${percent}%`,
        }}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
