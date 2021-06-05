import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import VideoCropper from '@components/studio/VideoEditor/VideoCropper'

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
  const data = JSON.parse(decodeURIComponent(router.query.data || '{}'))
  console.log(data.videoSources)

  return (
    <Container>
      <Text variant="pageHeading">Creator Studio</Text>
      <motion.div
        className="relative mx-auto h-64 w-96"
        layoutId={`video-${data.providerId}`}
      >
        {data.videoSources && <VideoCropper videoSources={data.videoSources} />}
      </motion.div>
    </Container>
  )
}

StudioEdit.Layout = Layout
