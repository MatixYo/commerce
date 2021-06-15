import { FC } from 'react'
import s from './AnimatedCard.module.css'
import { AnimatedCard } from '@components/AnimatedCard/AnimatedCard'

const AnimatedView: FC = () => {
  return (
    <div className={s.root}>
      <div className={s.animationDisplay}>
        <AnimatedCard />
      </div>
    </div>
  )
}

export default AnimatedView
