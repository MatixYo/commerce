import { FC, useCallback, useEffect, useState } from 'react'
import s from './TimelineSlider.module.css'
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider'
import { KeyboardHandle } from './KeyboardHandle'
import { Track } from './Track'
import { useStudio } from '@components/studio/context'

export const ScrubberSlider: FC = () => {
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
              <KeyboardHandle
                key={handle.id}
                handle={handle}
                domain={domain}
                className={s.scrubber}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
    </Slider>
  )
}
