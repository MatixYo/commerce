import { addAnimationMutation } from '../utils/mutations/add-animation-mutation'
import { fetcher } from '@framework/fetcher'
import { getAnimationVideoQuery } from '../utils/queries/get-animation-video-query'

export default async function getAnimationVideo(id: string): Promise<any> {
  const variables = {
    id,
  }

  const { animationVideo } = await fetcher({
    query: getAnimationVideoQuery,
    variables,
  })

  return animationVideo
}
