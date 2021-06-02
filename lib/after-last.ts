export function afterLast(string: string, limiter: string) {
  return string.slice(string.lastIndexOf(limiter) + 1)
}
