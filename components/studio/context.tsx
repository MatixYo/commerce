import {
  CroppedAreaType,
  SnapshotType,
  VideoItemType,
} from '@components/studio/types'
import React, { FC, useMemo } from 'react'

export interface State {
  videoItem: VideoItemType | undefined
  currentFrame: number
  keyframes: number[]
  snapshots: SnapshotType[]
  rotation: number
  croppedArea: CroppedAreaType
}

const initialState = {
  videoItem: undefined,
  currentFrame: 0,
  keyframes: [],
  snapshots: [],
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
      type: 'ADD_KEYFRAME'
      keyframe: number
    }
  | {
      type: 'DELETE_KEYFRAME'
      keyframe: number
    }
  | {
      type: 'SET_KEYFRAMES'
      keyframes: number[]
    }
  | {
      type: 'SET_SNAPSHOTS'
      snapshots: SnapshotType[]
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
        keyframes: [],
        snapshots: [],
      }
    }
    case 'SET_CURRENT_FRAME': {
      return {
        ...state,
        currentFrame: action.frameNumber,
      }
    }
    case 'ADD_KEYFRAME': {
      /* Here we prevent from adding duplicates and sorting keyframes after adding new one's */
      return {
        ...state,
        keyframes: [
          ...state.keyframes.filter((keyframe) => keyframe !== action.keyframe),
          action.keyframe,
        ].sort((a, b) => a - b),
      }
    }
    case 'DELETE_KEYFRAME': {
      return {
        ...state,
        keyframes: state.keyframes.filter(
          (keyframe) => keyframe !== action.keyframe
        ),
      }
    }
    case 'SET_KEYFRAMES': {
      return {
        ...state,
        keyframes: action.keyframes,
      }
    }
    case 'SET_SNAPSHOTS': {
      return {
        ...state,
        snapshots: action.snapshots,
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

  const addKeyframe = (keyframe: number) =>
    dispatch({ type: 'ADD_KEYFRAME', keyframe })
  const deleteKeyframe = (keyframe: number) =>
    dispatch({ type: 'DELETE_KEYFRAME', keyframe })
  const setKeyframes = (keyframes: number[]) =>
    dispatch({ type: 'SET_KEYFRAMES', keyframes })

  const setSnapshots = (snapshots: SnapshotType[]) =>
    dispatch({ type: 'SET_SNAPSHOTS', snapshots })

  const value = useMemo(
    () => ({
      ...state,
      setVideoItem,
      unsetVideoItem,
      setCurrentFrame,
      addKeyframe,
      deleteKeyframe,
      setKeyframes,
      setSnapshots,
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
