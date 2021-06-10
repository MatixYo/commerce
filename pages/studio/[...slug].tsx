import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import VideoCropper from '@components/studio/VideoEditor/VideoCropper'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'
import { useEffect, useMemo, useState } from 'react'
import { VideoItemType, VideoSourceType } from '@components/studio/types'
import cn from 'classnames'
import Timeline from '@components/studio/Timeline'
import getAnimationVideo from '@framework/animations/get-animation-video'
import { ManagedStudioContext, useStudio } from '@components/studio/context'

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

export default function StudioEdit() {
  const router = useRouter()

  const { videoItem, setVideoItem, setCurrentFrame } = useStudio()

  const [videoId, projectId] = router.query.slug as [string, string]

  useEffect(() => {
    ;(async () => {
      let item = videoItem
      if (!item) {
        item = await getAnimationVideo(videoId)
        setVideoItem(item)
      }

      setCurrentFrame(Math.ceil(OFFSET * item.numFrames))
    })()
  }, [videoItem, videoId])

  return (
    <Container>
      <Text variant="pageHeading">Creator Studio</Text>
      {videoItem && (
        <>
          <VideoCropper />
          <Timeline />
        </>
      )}
    </Container>
  )
}

StudioEdit.Layout = Layout
