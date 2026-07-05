import { useMemo } from 'react'

const DESKTOP_VIDEO_FPS = 60000 / 1001
const MOBILE_VIDEO_FPS = 30

function detectMobileProfile() {
  if (typeof window === 'undefined') {
    return { isMobile: false, videoFps: DESKTOP_VIDEO_FPS }
  }

  const isMobile =
    window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768

  return {
    isMobile,
    videoFps: isMobile ? MOBILE_VIDEO_FPS : DESKTOP_VIDEO_FPS,
  }
}

export function useDeviceScrollProfile() {
  const profile = useMemo(() => detectMobileProfile(), [])

  const lenisOptions = useMemo(
    () =>
      profile.isMobile
        ? {
            anchors: true,
            lerp: 0.092,
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.11,
            touchInertiaMultiplier: 1,
            wheelMultiplier: 0.65,
            touchMultiplier: 0.9,
            gestureOrientation: 'vertical' as const,
            autoRaf: true,
          }
        : {
            anchors: true,
            lerp: 0.075,
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.075,
            touchInertiaMultiplier: 1.15,
            wheelMultiplier: 0.65,
            touchMultiplier: 1,
            gestureOrientation: 'vertical' as const,
            autoRaf: true,
          },
    [profile.isMobile],
  )

  return { ...profile, lenisOptions }
}

export { DESKTOP_VIDEO_FPS, MOBILE_VIDEO_FPS }
