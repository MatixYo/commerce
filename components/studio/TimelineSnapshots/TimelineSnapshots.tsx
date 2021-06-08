import { FC, useEffect, useRef } from 'react'
import { VideoSourceType } from '@components/studio/types'
import VideoSnapshot from '@lib/video-snapshot'
import { useRect } from '@lib/hooks/useRect'
import cn from 'classnames'

interface Props {
  className?: string
  videoSources: VideoSourceType[]
  onLoadedChange?: (loaded: boolean) => void
}

const TimelineSnapshots: FC<Props> = ({
  className,
  videoSources,
  onLoadedChange,
}) => {
  const ref = useRef(null)
  const { width, height } = useRect(ref)

  useEffect(() => {
    ;(async function () {
      if (ref.current === null || width === 0 || height === 0) return
      if (onLoadedChange) onLoadedChange(false)

      const context = ref.current.getContext(`2d`)

      if (!context) {
        throw new Error('error creating canvas context')
      }

      const vs = new VideoSnapshot(videoSources)
      const { videoWidth, videoHeight, duration } = await vs.getProperties()

      const itemWidth = (videoWidth * height) / videoHeight
      const itemsCount = Math.ceil(width / itemWidth)

      for (let i = 0; i < itemsCount; i++) {
        const time = (i * duration) / itemsCount
        const video = await vs.takeSnapshot(time)
        context.drawImage(video, i * itemWidth, 0, itemWidth, height)
      }
      if (onLoadedChange) onLoadedChange(true)
    })()
  }, [ref, videoSources, width, height])

  return (
    <canvas
      ref={ref}
      className={cn('w-full h-full', className)}
      width={width}
      height={height}
    />
  )
}

export default TimelineSnapshots
