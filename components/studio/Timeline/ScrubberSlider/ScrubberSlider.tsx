import { FC } from 'react'
import s from './ScrubberSlider.module.css'
import { Handles, Rail, Slider } from 'react-compound-slider'
import { useStudio } from '@components/studio/context'
import { ScrubberHandle } from './'

const ScrubberSlider: FC = () => {
  const { videoItem, currentFrame, setCurrentFrame } = useStudio()

  const domain = [0, videoItem ? videoItem.numFrames : 1]

  return (
    <Slider
      mode={1}
      step={1}
      domain={domain}
      values={[currentFrame]}
      onUpdate={(values) => setCurrentFrame(values[0])}
      className={s.slider}
    >
      <Rail>
        {({ getRailProps }) => <div className={s.rail} {...getRailProps()} />}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div>
            {handles.map((handle) => (
              <ScrubberHandle
                key={handle.id}
                handle={handle}
                domain={domain}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
    </Slider>
  )
}

export default ScrubberSlider
