import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import Uploader from '@components/studio/Uploader'

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

export default function Studio() {
  const { data } = useCustomer()
  return (
    <Container>
      <Text variant="pageHeading">Creator Studio</Text>
      <Uploader />
    </Container>
  )
}

Studio.Layout = Layout
