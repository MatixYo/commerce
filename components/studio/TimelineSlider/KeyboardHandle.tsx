import { FC } from 'react'
import { GetHandleProps, SliderItem } from 'react-compound-slider'
import s from './TimelineSlider.module.css'
import cn from 'classnames'

interface HandleProps {
  domain: number[]
  handle: SliderItem
  getHandleProps: GetHandleProps
  disabled?: boolean
  className?: string
}

export const KeyboardHandle: FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
  className = s.handle,
}) => {
  return (
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
  )
}
