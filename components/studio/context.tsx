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
      type: 'SET_KEYFRAMES'
      keyframes: KeyframeType[]
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
      }
    }
    case 'SET_CURRENT_FRAME': {
      return {
        ...state,
        currentFrame: action.frameNumber,
      }
    }
    case 'SET_KEYFRAMES': {
      return {
        ...state,
        keyframes: action.keyframes,
      }
    }
    case 'ADD_KEYFRAME': {
      return {
        ...state,
        keyframes: [...state.keyframes, action.keyframe],
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
  }
}

export const StudioProvider: FC = (props) => {
  const [state, dispatch] = React.useReducer(studioReducer, initialState)

  const setVideoItem = (videoItem: VideoItemType) =>
    dispatch({ type: 'SET_VIDEO_ITEM', videoItem })
  const unsetVideoItem = () => dispatch({ type: 'UNSET_VIDEO_ITEM' })

  const setCurrentFrame = (frameNumber: number) =>
    dispatch({ type: 'SET_CURRENT_FRAME', frameNumber })

  const setKeyframes = (keyframes: KeyframeType[]) =>
    dispatch({ type: 'SET_KEYFRAMES', keyframes })
  const addKeyframe = (keyframe: KeyframeType) =>
    dispatch({ type: 'ADD_KEYFRAME', keyframe })
  const deleteKeyframe = (frameNumber: number) =>
    dispatch({ type: 'DELETE_KEYFRAME', frameNumber })

  const value = useMemo(
    () => ({
      ...state,
      setVideoItem,
      unsetVideoItem,
      setCurrentFrame,
      setKeyframes,
      addKeyframe,
      deleteKeyframe,
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
