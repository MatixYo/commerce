import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import VideoCropper from '@components/studio/VideoEditor/VideoCropper'
import TimelineSnapshots from '@components/studio/TimelineSnapshots'
import { useEffect, useMemo, useState } from 'react'
import { VideoSourceType } from '@components/studio/types'
import cn from 'classnames'
import Timeline from '@components/studio/Timeline'
import getAnimationVideo from '@framework/animations/get-animation-video'

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

export default function StudioEdit() {
  const router = useRouter()

  const [videoId, projectId] = router.query.slug as String[]

  const [data, setData] = useState({})

  useEffect(() => {
    ;(async () => {
      const nextData = await getAnimationVideo(videoId)
      nextData.videoSources = (nextData.videoSources || []).map(
        (item: VideoSourceType) => ({
          src: item.src,
          type: `video/${item.type}`,
        })
      )
      setData(nextData)
    })()
  }, [videoId])

  return (
    <Container>
      <Text variant="pageHeading">Creator Studio</Text>
      {data.hasOwnProperty('id') && (
        <>
          <motion.div
            className="relative mx-auto h-64 w-96"
            layoutId={`video-${data.providerId}`}
          >
            <VideoCropper
              videoSources={data.videoSources}
              classes={{ mediaClassName: 'h-64 w-96' }}
            />
          </motion.div>
          <Timeline
            videoSources={data.videoSources}
            numFrames={data.numFrames}
          />
        </>
      )}
    </Container>
  )
}

StudioEdit.Layout = Layout
