import { FC, useCallback, useEffect, useState } from 'react'
import s from './KeyframesSlider.module.css'
import { Handles, Slider, Tracks } from 'react-compound-slider'
import { KeyframeHandle, Track } from './index'
import { useStudio } from '@components/studio/context'

const KeyframesSlider: FC = () => {
  const { keyframes, setKeyframes, videoItem, setCurrentFrame } = useStudio()
  const [prevValues, setPrevValues] = useState([])

  const domain = [0, videoItem ? videoItem.numFrames : 1]

  /* Finds the one handle that was moved */
  const onUpdate = useCallback(
    (nextValues) => {
      const diff = nextValues.filter(
        (v: number, i: number) => prevValues[i] !== v
      )
      setPrevValues(nextValues)

      if (diff.length) {
        setCurrentFrame(diff[0])
      }
    },
    [prevValues]
  )

  return (
    <Slider
      mode={3}
      step={1}
      domain={domain}
      values={keyframes}
      onUpdate={onUpdate}
      onChange={setKeyframes}
      className={s.slider}
    >
      <Tracks>
        {({ tracks, getTrackProps }) =>
          tracks.length >= 2 && (
            <>
              <Track
                source={tracks[0].source}
                target={tracks[0].target}
                getTrackProps={getTrackProps}
              />
              <Track
                source={tracks[tracks.length - 1].source}
                target={tracks[tracks.length - 1].target}
                getTrackProps={getTrackProps}
              />
            </>
          )
        }
      </Tracks>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div>
            {handles.map((handle) => (
              <KeyframeHandle
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

export default KeyframesSlider
