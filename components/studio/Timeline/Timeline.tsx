import { FC, useState } from 'react'
import { VideoSourceType } from '@components/studio/types'
import cn from 'classnames'
import s from './Timeline.module.css'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'
import TimelineSlider from '@components/studio/TimelineSlider'

interface Props {
  videoSources: VideoSourceType[]
  numFrames: number
}

const Timeline: FC<Props> = ({ videoSources, numFrames }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(s.timeline, 'animate-pulse', {
        [s.loaded]: loaded,
      })}
    >
      <TimelineSnapshots
        videoSources={videoSources}
        onLoadedChange={(loaded: boolean) => {
          setLoaded(loaded)
        }}
        className={cn('rounded-xl', { [s.transparent]: !loaded })}
      />
      <TimelineSlider numFrames={numFrames} />
    </div>
  )
}

export default Timeline
