import { FC, useCallback, useEffect, useState } from 'react'
import s from './TimelineSlider.module.css'
import { Handles, Slider, Tracks } from 'react-compound-slider'
import { KeyboardHandle } from './KeyboardHandle'
import { Track } from './Track'
import { useStudio } from '@components/studio/context'
import { KeyframeType } from '@components/studio/types'

const OFFSET = 0.05
const COUNT = 4

export const KeyframesSlider: FC = () => {
  const { keyframes, setKeyframes, videoItem, setCurrentFrame } = useStudio()
  const [prevValues, setPrevValues] = useState([])

  useEffect(() => {
    if (!videoItem) return

    const innerValues = Array.from(Array(COUNT - 2).keys()).map(
      (i) => OFFSET + (1 - 2 * OFFSET) * ((i + 1) / (COUNT - 1))
    )

    const { numFrames } = videoItem

    setKeyframes([
      { frameNumber: Math.ceil(OFFSET * numFrames) },
      ...innerValues.map((v) => ({
        frameNumber: Math.ceil(v * numFrames),
      })),
      { frameNumber: Math.ceil((1 - OFFSET) * numFrames) },
    ])
  }, [videoItem])
  const domain = [0, videoItem ? videoItem.numFrames : 1]

  const onUpdate = useCallback(
    (newValues) => {
      const diff = newValues.filter(
        (v: number, i: number) => prevValues[i] !== v
      )
      setPrevValues(newValues)

      /* TODO przewijać też gdy jest onCLick na Handle */
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
      values={keyframes.map((k: KeyframeType) => k.frameNumber)}
      onUpdate={onUpdate}
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
