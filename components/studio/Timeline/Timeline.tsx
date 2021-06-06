import { FC, useState } from 'react'
import { VideoSourceType } from '@components/studio/types'
import cn from 'classnames'
import s from './Timeline.module.css'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'

interface Props {
  videoSources: VideoSourceType[]
}

const Timeline: FC<Props> = ({ videoSources }) => {
  const [timelineLoaded, setTimelineLoaded] = useState(false)

  return (
    <div className="h-16 mt-8 rounded-xl border-2 overflow-hidden">
      <TimelineSnapshots
        videoSources={videoSources}
        onLoadedChange={(loaded: boolean) => {
          setTimelineLoaded(loaded)
        }}
        className={cn(s.skeleton, 'animate-pulse', {
          [s.loaded]: timelineLoaded,
        })}
      />
    </div>
  )
}

export default Timeline
