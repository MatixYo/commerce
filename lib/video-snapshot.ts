import { VideoSourceType } from '@components/studio/types'
import { fireOnce } from '@lib/fire-once'

export interface Properties {
  videoWidth: number
  videoHeight: number
  duration: number
}

const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

class VideoSnapshot {
  videoSources?: VideoSourceType[]
  video?: HTMLVideoElement

  constructor(videoSources: VideoSourceType[]) {
    this.videoSources = videoSources
  }

  async takeSnapshot(time: number): Promise<HTMLVideoElement> {
    if (!this.video) await this.loadVideo(time)
    else {
      this.video.currentTime = time

      if (isSafari) this.video.play()

      await fireOnce(this.video, 'timeupdate')
      this.video.pause()

      return this.video
    }

    //@ts-ignore
    if (!this.video?.videoWidth || !this.video?.videoHeight) {
      throw new Error('error retrieving video dimensions')
    }

    return this.video
  }

  // TODO: implement video cache
  private loadVideo = (time: number = 0): Promise<HTMLVideoElement> =>
    new Promise(async (resolve, reject) => {
      if (!this.videoSources)
        reject(new Error('video sources have not been provided'))
      const video = document.createElement('video')

      video.preload = 'metadata'
      video.muted = true

      //@ts-ignore
      const sourcesElements = this.videoSources.map(({ src, type }) => {
        const sourceEl = document.createElement('source')
        sourceEl.src = src
        sourceEl.type = type
        return sourceEl
      })
      video.append(...sourcesElements)

      if (time === 0) {
        video.play()
      } else {
        video.currentTime = time

        // Safari needs to always play the video
        if (isSafari) video.play()
      }
      this.video = video

      video.addEventListener('error', () => {
        reject(new Error('failed to load video'))
      })

      await fireOnce(this.video, 'timeupdate')
      this.video.pause()

      resolve(this.video)
    })

  getProperties = async (): Promise<Properties> => {
    if (!this.video) await this.loadVideo()

    return {
      //@ts-ignore
      videoWidth: this.video?.videoWidth,
      //@ts-ignore
      videoHeight: this.video?.videoHeight,
      //@ts-ignore
      duration: this.video?.duration,
    }
  }
}

export default VideoSnapshot
