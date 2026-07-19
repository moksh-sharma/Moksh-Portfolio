import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { Overlay } from './components/Overlay'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'
import {
  ScrollFrameBackground,
  type FrameLoadState,
} from './components/ScrollFrameBackground'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [frameLoad, setFrameLoad] = useState<FrameLoadState>({
    progress: 0,
    active: true,
  })

  const lenisOptions = useMemo(
    () => ({
      anchors: true,
      lerp: 0.09,
      smoothWheel: true,
      // Match desktop-smooth feel on mobile touch (Lenis syncs touch → scrollTop).
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchMultiplier: 1.35,
      // Avoid rubber-band fighting the frame scrubber on iOS.
      overscroll: false as const,
    }),
    [],
  )

  const onLoadProgress = useCallback((state: FrameLoadState) => {
    setFrameLoad(state)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-dvh min-h-0 bg-[#050505] text-neutral-50 relative selection:bg-indigo-500/30 font-sans overflow-hidden"
    >
      <ErrorBoundary name="ScrollFrameBackground">
        {mounted && <ScrollFrameBackground onLoadProgress={onLoadProgress} />}
      </ErrorBoundary>

      <ReactLenis
        id="portfolio-scroll"
        className="relative z-10 h-full w-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[max(0px,env(safe-area-inset-bottom))]"
        options={lenisOptions}
      >
        <ErrorBoundary name="Overlay">
          <Overlay />
        </ErrorBoundary>
      </ReactLenis>

      <div className="pointer-events-none fixed inset-0 z-[150] h-full w-full opacity-[0.025] mix-blend-screen">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <LoadingScreen progress={frameLoad.progress} active={frameLoad.active} />
    </div>
  )
}
