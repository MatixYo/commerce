import { CSSProperties, FC, useMemo, useRef } from 'react'
import { BaseLayer, RevealingLayer } from './'
import s from './AnimatedCard.module.css'
import {
  motion,
  MotionValue,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion'
import { useRect } from '@lib/hooks/useRect'
import { useWindowSize } from '@lib/hooks/useWindowSize'
import ReverseEditor from '@components/ReverseEditor/ReverseEditor'

interface CSSProps extends CSSProperties {
  '--offset': MotionValue<any>
  '--rotation': MotionValue<any>
  '--elevation': MotionValue<any>
  '--zIndex': MotionValue<any>
  '--shadowOffset': MotionValue<any>
}

const lineWidthMm = 3

const AnimatedCard: FC = () => {
  const ref = useRef(null)
  const { top, height: cardHeight } = useRect(ref)

  const { height: h } = useWindowSize() /* screen height */

  const o = useMemo(() => {
    // @ts-ignore
    return top + (h + cardHeight) / 2 + 100
  }, [top, h, cardHeight]) /* card offset */

  const { scrollY } = useViewportScroll()
  const sprungScroll = useSpring(scrollY, { damping: 500, stiffness: 10000 })

  const offset = useTransform(scrollY, [o, o + 5 * o, o + 7 * h], [0, 190, 0])
  const roundOffset = useTransform(
    offset,
    (v) => Math.round(v / lineWidthMm) * lineWidthMm
  )
  const sprungOffset = useSpring(roundOffset, {
    damping: 800,
    stiffness: 10000,
  })
  const rotation = useTransform(sprungScroll, [o + 5 * h, o + 7 * h], [0, 180])
  const elevation = useTransform(sprungScroll, [o + 5 * h, o + 7 * h], [0, 300])
  const zIndex = useTransform(sprungScroll, (latestScrollY) =>
    latestScrollY < o + 5 * h ? 10 : 30
  )
  const shadowOffset = useTransform(
    sprungScroll,
    [o + 5 * h, o + 6 * h, o + 7 * h],
    [0, 40, 0]
  )

  return (
    <motion.div
      className={s.card}
      style={
        {
          '--offset': sprungOffset,
          '--rotation': rotation,
          '--elevation': elevation,
          '--z-index': zIndex,
          '--shadow-offset': shadowOffset,
        } as unknown as CSSProps
      }
    >
      <div ref={ref} className={s.inner}>
        <BaseLayer className={s.base} />
        <div className={s.reverse}>
          <ReverseEditor />
        </div>
      </div>
      <div className={s.revealingContainer}>
        <RevealingLayer className={s.revealing} />
      </div>
    </motion.div>
  )
}

export { AnimatedCard }
