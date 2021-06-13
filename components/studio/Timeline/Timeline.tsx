import { FC, useState } from 'react'
import cn from 'classnames'
import s from './Timeline.module.css'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'
import ScrubberSlider from './ScrubberSlider'
import KeyframesSlider from './KeyframesSlider'

const Timeline: FC = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn(s.container)}>
      <div
        className={cn(s.background, 'animate-pulse', {
          'animate-none': loaded,
        })}
      />
      <TimelineSnapshots
        onLoadedChange={setLoaded}
        className={cn(s.snapshots, { 'opacity-0': !loaded })}
      />
      <KeyframesSlider />
      <ScrubberSlider />
    </div>
  )
}

export default Timeline
