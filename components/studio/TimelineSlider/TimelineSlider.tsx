import { FC, useEffect, useState } from 'react'
import s from './TimelineSlider.module.css'
import { Handles, Slider, Tracks } from 'react-compound-slider'
import { KeyboardHandle } from './KeyboardHandle'
import { Track } from './Track'

interface Props {
  numFrames: number
}
const OFFSET = 0.1
const COUNT = 4

const TimelineSlider: FC<Props> = ({ numFrames }) => {
  const [values, setValues] = useState([0, 1, 2, 3])

  useEffect(() => {
    const innerValues = Array.from(Array(COUNT - 2).keys()).map(
      (i) => OFFSET + (1 - 2 * OFFSET) * ((i + 1) / (COUNT - 1))
    )

    setValues([
      Math.ceil(OFFSET * numFrames),
      ...innerValues.map((v) => Math.ceil(v * numFrames)),
      Math.ceil((1 - OFFSET) * numFrames),
    ])
  }, [numFrames])
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
      <Tracks>
        {({ tracks, getTrackProps }) => (
          <div>
            {tracks
              .filter((_, i) => i === 0 || i === tracks.length - 1)
              .map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
          </div>
        )}
      </Tracks>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div>
            {handles.map((handle) => (
              <KeyboardHandle
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

export default TimelineSlider
