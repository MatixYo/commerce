import { FC, useRef, useEffect, useState } from 'react'
import cn from 'classnames'
import s from '@components/studio/GifSearch/GifSearch.module.css'
import { motion } from 'framer-motion'

interface Props {
  className?: string
  data: {
    gfyId: string
    gif100px: string
    gfyName: string
    width: number
    height: number
    avgColor: string
  }
  onClick?: () => void
}

export const GifItem: FC<Props> = ({ className, data, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.img
      src={data.gif100px}
      alt={data.gfyName}
      className={cn(s.gif, className, { [s.loaded]: isLoaded })}
      onLoad={() => setIsLoaded(true)}
      onClick={() => onClick && onClick()}
      style={{
        // @ts-ignore
        '--aspect-ratio': data.width / data.height,
        backgroundColor: data.avgColor,
      }}
      layoutId={`video-${data.gfyId}`}
    />
  )
}
