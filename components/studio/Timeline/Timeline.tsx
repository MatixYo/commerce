import { FC, useState } from 'react'
import cn from 'classnames'
import s from './Timeline.module.css'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'
import {
  KeyframesSlider,
  ScrubberSlider,
} from '@components/studio/TimelineSlider'

const Timeline: FC = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(s.timeline, 'animate-pulse', {
        [s.loaded]: loaded,
      })}
    >
      <TimelineSnapshots
        onLoadedChange={(loaded: boolean) => {
          setLoaded(loaded)
        }}
        className={cn('rounded-xl', { [s.transparent]: !loaded })}
      />
      <ScrubberSlider />
      <KeyframesSlider />
    </div>
  )
}

export default Timeline
