export type CreatedUsingType =
  | 'gfycat'
  | 'uploader'
  | 'url' /* TODO mabe change to enum */

export type VideoSourceType = {
  src: string
  type: string
}

export type VideoItemType = {
  providerId: string
  createdUsing: CreatedUsingType
  originalSource: string | null
  videoSources: [VideoSourceType]
  width: number
  height: number
  frameRate: number
  numFrames: number
  avgColor: string | null
}

export type KeyframeType = {
  frameNumber: number
}

export type CroppedAreaType = {
  width: number
  height: number
  x: number
  y: number
}
