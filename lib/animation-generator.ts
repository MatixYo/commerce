export function drawBaseLayer(
  destination: HTMLCanvasElement,
  sourceList: HTMLCanvasElement[],
  lineWidth: number = 3
) {
  const { width, height } = destination

  const context = destination.getContext('2d')
  if (!context) {
    throw new Error('error creating canvas context')
  }
  context.clearRect(0, 0, width, height)

  /* TODO sprawdzić warunki graniczne */
  for (let dx = 0; dx < width; dx += lineWidth) {
    context.drawImage(
      sourceList[(dx / lineWidth) % sourceList.length],
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
