import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { useRouter } from 'next/router'
import VideoCropper from '@components/studio/VideoEditor/VideoCropper'
import { useEffect, useRef, useState } from 'react'
import Timeline from '@components/studio/Timeline'
import getAnimationVideo from '@framework/animations/get-animation-video'
import { useStudio } from '@components/studio/context'
import VideoSnapshot from '@lib/video-snapshot'
import { SnapshotType } from '@components/studio/types'
import AnimatedView from '@components/AnimatedCard'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const { pages } = await commerce.getAllPages({ config, preview })
  const { categories } = await commerce.getSiteInfo({ config, preview })

  return {
    props: { pages, categories },
  }
}

export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  }
}

const OFFSET = 0.05
const COUNT = 4

export default function StudioEdit() {
  const router = useRouter()

  const {
    videoItem,
    setVideoItem,
    setCurrentFrame,
    keyframes,
    snapshots,
    setKeyframes,
    setSnapshots,
    unsetVideoItem,
  } = useStudio()

  const [videoId, projectId] = router.query.slug as [string, string]

  useEffect(() => {
    if (!videoItem) return

    const innerValues = Array.from(Array(COUNT - 2).keys()).map(
      (i) => OFFSET + (1 - 2 * OFFSET) * ((i + 1) / (COUNT - 1))
    )

    const { numFrames } = videoItem

    setKeyframes([
      Math.ceil(OFFSET * numFrames),
      ...innerValues.map((v) => Math.ceil(v * numFrames)),
      Math.ceil((1 - OFFSET) * numFrames),
    ])
  }, [setKeyframes, videoItem])

  useEffect(() => {
    ;(async () => {
      let item = videoItem
      if (!item) {
        item = await getAnimationVideo(videoId)
        setVideoItem(item)
      }

      setCurrentFrame(Math.ceil(OFFSET * item.numFrames))
    })()
  }, [videoItem, videoId, setCurrentFrame, setVideoItem])

  const videoSnapshot = useRef<VideoSnapshot | null>(null)

  useEffect(() => {
    if (!videoItem) return

    videoSnapshot.current = new VideoSnapshot(videoItem.videoSources)
  }, [videoItem])

  /* TODO sprawdzać czy są nowe canvasy w state */
  const [loadingSnapshots, setLoadingSnapshots] = useState(false)

  useEffect(() => {
    if (!videoItem || !keyframes || !videoSnapshot.current || loadingSnapshots)
      return
    /* Remove snapshots of keyframes that don't exist anymore */
    const nextSnapshots = snapshots.filter((snapshot: SnapshotType) =>
      keyframes.includes(snapshot[0])
    )

    /* Check if no new snapshots have to be added */
    /* TODO optimize how many times this function is rendered */
    if (
      keyframes.every((keyframe: number) =>
        nextSnapshots.some((snapshot: SnapshotType) => snapshot[0] == keyframe)
      )
    )
      return
    ;(async () => {
      setLoadingSnapshots(true)

      // @ts-ignore
      const { videoWidth, videoHeight } =
        await videoSnapshot.current?.getProperties()
      if (!videoWidth || !videoHeight) return

      for (const keyframe of keyframes) {
        if (
          !nextSnapshots.some(
            (snapshot: SnapshotType) => snapshot[0] === keyframe
          )
        ) {
          console.log('redrawing', keyframe)
          const canvas = document.createElement('canvas')
          canvas.width = videoWidth
          canvas.height = videoHeight

          const context = canvas.getContext('2d')
          if (!context) throw new Error('error creating canvas context')

          //@ts-ignore
          const video = await videoSnapshot.current.takeSnapshot(
            keyframe / videoItem.frameRate
          )
          context.drawImage(video, 0, 0, videoWidth, videoHeight)

          nextSnapshots.push([keyframe, canvas])
        }
      }

      setLoadingSnapshots(false)
      setSnapshots(nextSnapshots)
    })()
  }, [
    videoItem,
    videoSnapshot,
    keyframes,
    snapshots,
    loadingSnapshots,
    setSnapshots,
  ])

  useEffect(() => {
    return () => {
      unsetVideoItem()
    }
  }, [unsetVideoItem])

  return (
    <Container>
      <Text variant="pageHeading">Creator Studio</Text>
      {videoItem && (
        <>
          <VideoCropper />
          <Timeline />
          <AnimatedView />
        </>
      )}
    </Container>
  )
}

StudioEdit.Layout = Layout
