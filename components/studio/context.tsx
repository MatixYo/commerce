import {
  CroppedAreaType,
  KeyframeType,
  VideoItemType,
} from '@components/studio/types'
import React, { FC, useMemo } from 'react'

export interface State {
  videoItem: VideoItemType | undefined
  currentFrame: number
  keyframes: KeyframeType[]
  rotation: number
  croppedArea: CroppedAreaType
}

const initialState = {
  videoItem: undefined,
  currentFrame: 0,
  keyframes: [],
  rotation: 0,
  croppedArea: { width: 0, height: 0, x: 0, y: 0 },
}

type Action =
  | {
      type: 'SET_VIDEO_ITEM'
      videoItem: VideoItemType
    }
  | {
      type: 'UNSET_VIDEO_ITEM'
    }
  | {
      type: 'SET_CURRENT_FRAME'
      frameNumber: number
    }
  | {
      type: 'UPDATE_KEYFRAME'
      keyframe: KeyframeType
    }
  | {
      type: 'ADD_KEYFRAME'
      keyframe: KeyframeType
    }
  | {
      type: 'DELETE_KEYFRAME'
      frameNumber: number
    }
  | {
      type: 'UPDATE_KEYFRAMES'
      keyframes: KeyframeType[]
    }
  | {
      type: 'ROTATE_CW'
    }
  | {
      type: 'ROTATE_CCW'
    }

export const StudioContext = React.createContext<State | any>(initialState)

StudioContext.displayName = 'StudioContext'

function studioReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_VIDEO_ITEM': {
      return {
        ...state,
        videoItem: action.videoItem,
      }
    }
    case 'UNSET_VIDEO_ITEM': {
      return {
        ...state,
        videoItem: undefined,
        keyframes: undefined,
      }
    }
    case 'SET_CURRENT_FRAME': {
      return {
        ...state,
        currentFrame: action.frameNumber,
      }
    }
    case 'UPDATE_KEYFRAME': {
      return {
        ...state,
        keyframes: state.keyframes.map((keyframe) =>
          keyframe.frameNumber === action.keyframe.frameNumber
            ? {
                ...keyframe,
                ...action.keyframe,
              }
            : keyframe
        ),
      }
    }
    case 'ADD_KEYFRAME': {
      /* Here we prevent from adding duplicates and sorting keyframes after adding new one's */
      return {
        ...state,
        keyframes: [
          ...state.keyframes.filter(
            (keyframe) => keyframe.frameNumber !== action.keyframe.frameNumber
          ),
          action.keyframe,
        ].sort((a, b) => a.frameNumber - b.frameNumber),
      }
    }
    case 'DELETE_KEYFRAME': {
      return {
        ...state,
        keyframes: state.keyframes.filter(
          (keyframe) => keyframe.frameNumber !== action.frameNumber
        ),
      }
    }
    case 'UPDATE_KEYFRAMES': {
      return {
        ...state,
        keyframes: action.keyframes.map((nextKeyframe) => {
          const prevKeyframe = state.keyframes.find(
            (keyframe) => nextKeyframe.frameNumber === keyframe.frameNumber
          )
          return typeof prevKeyframe !== 'undefined'
            ? {
                ...prevKeyframe,
                ...nextKeyframe,
              }
            : nextKeyframe
        }),
      }
    }
  }
}

export const StudioProvider: FC = (props) => {
  const [state, dispatch] = React.useReducer(studioReducer, initialState)

  const setVideoItem = (videoItem: VideoItemType) =>
    dispatch({ type: 'SET_VIDEO_ITEM', videoItem })
  const unsetVideoItem = () => dispatch({ type: 'UNSET_VIDEO_ITEM' })

  const setCurrentFrame = (frameNumber: number) =>
    dispatch({ type: 'SET_CURRENT_FRAME', frameNumber })

  const updateKeyframe = (keyframe: KeyframeType) =>
    dispatch({ type: 'UPDATE_KEYFRAME', keyframe })
  const addKeyframe = (keyframe: KeyframeType) =>
    dispatch({ type: 'ADD_KEYFRAME', keyframe })
  const deleteKeyframe = (frameNumber: number) =>
    dispatch({ type: 'DELETE_KEYFRAME', frameNumber })
  const updateKeyframes = (keyframes: KeyframeType[]) =>
    dispatch({ type: 'UPDATE_KEYFRAMES', keyframes })

  const value = useMemo(
    () => ({
      ...state,
      setVideoItem,
      unsetVideoItem,
      setCurrentFrame,
      updateKeyframe,
      addKeyframe,
      deleteKeyframe,
      updateKeyframes,
    }),
    [state]
  )

  return <StudioContext.Provider value={value} {...props} />
}

export const useStudio = () => {
  const context = React.useContext(StudioContext)
  if (context === undefined) {
    throw new Error(`useStudio must be used within a StudioProvider`)
  }
  return context
}

export const ManagedStudioContext: FC = ({ children }) => (
  <StudioProvider>{children}</StudioProvider>
)
