import { addAnimationMutation } from '../utils/mutations/add-animation-mutation'
import { fetcher } from '@framework/fetcher'

export default async function addAnimationVideo(input: any): Promise<any> {
  const variables = {
    input,
  }

  const { submitAnimationVideo } = await fetcher({
    query: addAnimationMutation,
    variables,
  })

  return submitAnimationVideo
}
