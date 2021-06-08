export const getAnimationVideoQuery = /* GraphQL */ `
  query getAnimationVideo($id: ID!) {
    animationVideo(id: $id) {
      id
      videoSources {
        src
        type
      }
      createdUsing
      providerId
      originalSource
      width
      height
      frameRate
      numFrames
      avgColor
    }
  }
`
