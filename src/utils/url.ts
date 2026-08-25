export function toAbsolute(url?: string): string {
  if (!url) return ''
  if (/^https?:\/\//.test(url)) return url
  return new URL(url, window.location.origin).toString()
}
