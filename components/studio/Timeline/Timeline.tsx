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
  const [timelineLoaded, setTimelineLoaded] = useState(false)

  return (
    <div className={s.timeline}>
      <TimelineSnapshots
        videoSources={videoSources}
        onLoadedChange={(loaded: boolean) => {
          setTimelineLoaded(loaded)
        }}
        className={cn(s.skeleton, 'animate-pulse', {
          [s.loaded]: timelineLoaded,
        })}
      />
      <TimelineSlider numFrames={numFrames} />
    </div>
  )
}

export default Timeline
