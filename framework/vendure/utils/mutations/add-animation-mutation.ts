export const addAnimationMutation = /* GraphQL */ `
  mutation addAnimation($input: SubmitAnimationVideoInput!) {
    submitAnimationVideo(input: $input) {
      id
    }
  }
`
