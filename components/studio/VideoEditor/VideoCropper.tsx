import Cropper from 'react-easy-crop'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStudio } from '@components/studio/context'

type VideoSourceType = {
  src: string
  type: string
}

interface Props {
  classes: object
  children?: any
}

const VideoCropper: FC<Props> = ({ classes }) => {
  const { currentFrame, videoItem } = useStudio()

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current?.videoRef && videoItem) {
      ref.current.videoRef.currentTime = currentFrame / videoItem.frameRate
    }
  }, [ref, currentFrame, videoItem])

  console.log(videoItem)

  return (
    <Cropper
      mediaProps={{ autoPlay: false, muted: true }}
      video={videoItem?.videoSources}
      crop={crop}
      ref={ref}
      classes={classes}
      onCropChange={setCrop}
      showGrid={false}
    />
  )
}

export default VideoCropper
