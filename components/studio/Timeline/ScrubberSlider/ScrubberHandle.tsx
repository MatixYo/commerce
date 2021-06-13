import { FC, useMemo } from 'react'
import { GetHandleProps, SliderItem } from 'react-compound-slider'
import s from './ScrubberSlider.module.css'
import cn from 'classnames'
import { useStudio } from '@components/studio/context'
import { Plus } from '@components/icons'

interface HandleProps {
  domain: number[]
  handle: SliderItem
  getHandleProps: GetHandleProps
  disabled?: boolean
}

export const ScrubberHandle: FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
}) => {
  const { addKeyframe, keyframes } = useStudio()

  const hideAddButton = useMemo(() => {
    return keyframes.includes(value)
  }, [keyframes, value])

  return (
    <div
      className={s.scrubberContainer}
      style={{
        left: `${percent}%`,
      }}
    >
      <button
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(s.scrubber, { [s.disabled]: disabled })}
        {...getHandleProps(id)}
      />
      <button
        className={cn(s.add, { invisible: hideAddButton })}
        onClick={() => addKeyframe(value)}
      >
        <Plus />
      </button>
    </div>
  )
}
