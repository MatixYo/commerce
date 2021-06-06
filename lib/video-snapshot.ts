import { VideoSourceType } from '@components/studio/types'

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
      this.video.addEventListener('timeupdate', function timeupdateHandler() {
        this.removeEventListener('timeupdate', timeupdateHandler)
        this.pause()
        return this
      })
    }

    if (!this.video?.videoWidth || !this.video?.videoHeight) {
      throw new Error('error retrieving video dimensions')
    }

    return this.video
  }

  // TODO: implement video cache
  private loadVideo = (time: number = 0): Promise<HTMLVideoElement> =>
    new Promise((resolve, reject) => {
      if (typeof this.videoSources === 'undefined')
        reject(new Error('video sources have not been provided'))
      const video = document.createElement('video')

      video.preload = 'metadata'
      video.muted = true

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

      // loadedmetadata, loadeddata, play, playing
      video.addEventListener('timeupdate', function timeupdateHandler() {
        video.removeEventListener('timeupdate', timeupdateHandler)
        video.pause()
        resolve(video)
      })
      video.addEventListener('error', () => {
        reject(new Error('failed to load video'))
      })
    })

  getProperties = async (): Promise<Properties> => {
    if (!this.video) await this.loadVideo()

    return {
      videoWidth: this.video?.videoWidth,
      videoHeight: this.video?.videoHeight,
      duration: this.video?.duration,
    }
  }
}

export default VideoSnapshot
