import Cropper from 'react-easy-crop'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStudio } from '@components/studio/context'
import { motion } from 'framer-motion'
import s from './VideoEditor.module.css'

type VideoSourceType = {
  src: string
  type: string
}

interface Props {
  children?: any
}

const VideoCropper: FC<Props> = () => {
  const { currentFrame, videoItem } = useStudio()

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current?.videoRef && videoItem) {
      ref.current.videoRef.currentTime = currentFrame / videoItem.frameRate
    }
  }, [ref, currentFrame, videoItem])

  return (
    <motion.div
      className={s.container}
      layoutId={`${videoItem.createdUsing}-${videoItem.providerId}`}
    >
      <Cropper
        mediaProps={{ autoPlay: false, muted: true }}
        video={videoItem?.videoSources}
        ref={ref}
        cropSize={{ width: 750, height: 500 }}
        crop={crop}
        onCropChange={setCrop}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={false}
        restrictPosition={false}
        classes={{
          containerClassName: '',
          mediaClassName: '',
          cropAreaClassName: s.cropArea,
        }}
      />
    </motion.div>
  )
}

export default VideoCropper
