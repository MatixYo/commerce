import { FC, useState } from 'react'
import { VideoSourceType } from '@components/studio/types'
import cn from 'classnames'
import s from './TimelineSlider.module.css'
import { Handles, Slider } from 'react-compound-slider'
import { KeyboardHandle } from './KeyboardHandle'
import { getHandles } from 'react-compound-slider/dist/types/Slider/utils'

interface Props {
  numFrames: number
}

const TimelineSlider: FC<Props> = ({ numFrames }) => {
  const [values, setValues] = useState([0, 5, 10, 20])

  const domain = [0, numFrames]

  return (
    <Slider
      mode={3}
      step={1}
      domain={domain}
      values={values}
      onChange={(values) => {
        setValues(values)
      }}
      className={s.slider}
    >
      <Handles>
        {({ handles, getHandleProps }) => (
          <>
            {handles.map((handle) => (
              <KeyboardHandle
                key={handle.id}
                handle={handle}
                domain={domain}
                getHandleProps={getHandleProps}
              />
            ))}
          </>
        )}
      </Handles>
    </Slider>
  )
}

export default TimelineSlider
