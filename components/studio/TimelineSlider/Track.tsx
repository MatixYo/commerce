import { FC } from 'react'
import s from './TimelineSlider.module.css'

interface TrackProps {
  source: {
    id: string
    value: number
    percent: number
  }
  target: {
    id: string
    value: number
    percent: number
  }
  getTrackProps: () => any
  disabled?: boolean
}

export const Track: FC<TrackProps> = ({
  source,
  target,
  getTrackProps,
  disabled = false,
}) => {
  return (
    <div
      className={s.track}
      style={{
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  )
}
