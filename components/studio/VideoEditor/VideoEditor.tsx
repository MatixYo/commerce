import { FC, useRef, useEffect, useState } from 'react'
import cn from 'classnames'
import s from '@components/studio/GifSearch/GifSearch.module.css'

interface Props {
  className?: string
}

const VideoEditor: FC<Props> = ({ className, data, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <img
      src={data.gif100px}
      alt={data.gfyName}
      className={cn(s.gif, className, { [s.loaded]: isLoaded })}
      onLoad={() => setIsLoaded(true)}
      onClick={() => onClick && onClick()}
      style={{
        '--aspect-ratio': data.width / data.height,
        backgroundColor: data.avgColor,
      }}
    />
  )
}

export default VideoEditor
