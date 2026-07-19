/** Web-optimized scroll sequence (every 2nd source frame @ 1280w JPEG). */
export const SCROLL_FRAME_COUNT = 324

export function scrollFrameUrl(index1Based: number): string {
  const n = String(Math.min(SCROLL_FRAME_COUNT, Math.max(1, index1Based))).padStart(3, '0')
  return `/frames/frame_${n}.jpg`
}
