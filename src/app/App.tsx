import { useState, useEffect, useMemo } from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { ScrollVideoProvider } from './context/ScrollVideoContext'
import { ScrollVideoBackground } from './components/ScrollVideoBackground'
import { Overlay } from './components/Overlay'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'

export default function App() {
  const [mounted, setMounted] = useState(false)

  const lenisOptions = useMemo(
    () => ({
      anchors: true,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      wheelMultiplier: 0.65,
      touchMultiplier: 1,
    }),
    [],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ScrollVideoProvider>
      <div className="w-full h-dvh min-h-0 bg-[#050505] text-neutral-50 relative selection:bg-indigo-500/30 font-sans overflow-hidden">
        <ReactLenis
          id="portfolio-scroll"
          className="relative z-10 h-full w-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[max(0px,env(safe-area-inset-bottom))]"
          options={lenisOptions}
        >
          {mounted && (
            <ErrorBoundary name="ScrollVideoBackground">
              <ScrollVideoBackground />
            </ErrorBoundary>
          )}
          <ErrorBoundary name="Overlay">
            <Overlay />
          </ErrorBoundary>
        </ReactLenis>

        {/* Cinematic Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[150] h-full w-full opacity-[0.025] mix-blend-screen">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <LoadingScreen />
      </div>
    </ScrollVideoProvider>
  )
}
