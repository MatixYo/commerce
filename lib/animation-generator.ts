function drawFitIntoBox(
  source: HTMLCanvasElement,
  width: number,
  height: number
) {
  const destination = document.createElement('canvas')

  destination.width = width
  destination.height = height

  const context = destination.getContext('2d')
  if (!context) {
    throw new Error('error creating canvas context')
  }

  const scale = Math.min(width / source.width, height / source.height)

  const dWidth = source.width * scale
  const dHeight = source.height * scale
  const dx = (width - dWidth) / 2
  const dy = (height - dHeight) / 2
  context.drawImage(
    source,
    0,
    0,
    source.width,
    source.height,
    dx,
    dy,
    dWidth,
    dHeight
  )

  return destination
}

export function drawBaseLayer(
  destination: HTMLCanvasElement,
  sourceList: HTMLCanvasElement[],
  lineWidth: number = 3
) {
  if (sourceList.length < 2) {
    throw new Error('at least two keyframes have to be provided')
  }

  const { width, height } = destination

  const context = destination.getContext('2d')
  if (!context) {
    throw new Error('error creating canvas context')
  }
  context.clearRect(0, 0, width, height)

  const fitCanvases = sourceList.map((canvas) =>
    drawFitIntoBox(canvas, width, height)
  )

  for (let dx = 0; dx < width; dx += lineWidth) {
    context.drawImage(
      fitCanvases[(dx / lineWidth) % fitCanvases.length],
      dx,
      0,
      lineWidth,
      height,
      dx,
      0,
      lineWidth,
      height
    )
  }
}

export function drawRevealingLayer(
  destination: HTMLCanvasElement,
  framesCount: number,
  lineWidth: number = 3
) {
  if (framesCount < 2) {
    throw new Error('at least two keyframes are needed')
  }

  const { width, height } = destination

  const context = destination.getContext('2d')
  if (!context) {
    throw new Error('error creating canvas context')
  }
  context.clearRect(0, 0, width, height)

  for (let dx = 0; dx < width; dx += framesCount * lineWidth) {
    context.fillRect(dx, 0, (framesCount - 1) * lineWidth, height)
  }
}
