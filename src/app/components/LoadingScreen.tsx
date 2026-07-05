import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useScrollVideo } from '../context/ScrollVideoContext'
import BouncingDots from './loading/BouncingDots'
import LoaderCounter from './loading/LoaderCounter'

const MIN_VISIBLE_MS = 2500
const LOADER_DURATION_MS = 3500
const EXIT_DELAY_MS = 380
const MAX_BOOT_MS = 10000
const LERP = 0.045
const EASE = [0.22, 1, 0.36, 1] as const

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function easeOutCubic(t: number) {
  return 1 - (1 - clamp(t, 0, 1)) ** 3
}

function timeCappedProgress(elapsedMs: number, actualProgress: number) {
  const timeProgress = easeOutCubic(Math.min(1, elapsedMs / LOADER_DURATION_MS)) * 100
  return Math.min(actualProgress, timeProgress)
}

function getLoadingStatus(progress: number, ready: boolean) {
  if (ready && progress >= 99) return 'Opening portfolio'
  if (progress >= 94) return 'Syncing scroll experience'
  if (progress >= 72) return 'Caching video frames'
  if (progress >= 8) return 'Loading background film'
  return 'Initializing experience'
}

export function LoadingScreen() {
  const { progress, ready, setReady } = useScrollVideo()
  const reduceMotion = useReducedMotion() ?? false
  const [minElapsed, setMinElapsed] = useState(false)
  const [show, setShow] = useState(true)
  const [display, setDisplay] = useState(0)

  const progressRef = useRef(progress)
  const readyRef = useRef(ready)
  const minElapsedRef = useRef(minElapsed)
  const showRef = useRef(show)
  const displayRef = useRef(0)
  const startedAtRef = useRef(performance.now())
  const finishedRef = useRef(false)
  const hideTimeoutRef = useRef<number | null>(null)

  progressRef.current = progress
  readyRef.current = ready
  minElapsedRef.current = minElapsed
  showRef.current = show

  const status = useMemo(() => getLoadingStatus(display, ready), [display, ready])
  const counterValue = Math.round(clamp(display, 0, 100))
  const canDismiss = minElapsed && ready

  const scheduleHide = () => {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = window.setTimeout(() => setShow(false), EXIT_DELAY_MS)
  }

  useEffect(() => {
    const t = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (finishedRef.current || !showRef.current) return
      setReady(true)
      finishedRef.current = true
      displayRef.current = 100
      setDisplay(100)
      scheduleHide()
    }, MAX_BOOT_MS)
    return () => window.clearTimeout(t)
  }, [setReady])

  useEffect(() => {
    if (!show) return
    const scrollRoot = document.getElementById('portfolio-scroll')
    scrollRoot?.classList.add('overflow-hidden')
    return () => scrollRoot?.classList.remove('overflow-hidden')
  }, [show])

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!show || finishedRef.current) return

    const tickDisplay = (elapsed: number) => {
      const p = clamp(Number.isFinite(progressRef.current) ? progressRef.current : 0, 0, 100)
      const minOk = minElapsedRef.current
      const isLoading = !readyRef.current

      let target: number
      if (minOk && !isLoading) {
        target = 100
      } else {
        target = timeCappedProgress(elapsed, p)
      }

      const cur = displayRef.current
      const closing = minOk && !isLoading
      const lerpAmt = closing ? 0.18 : LERP
      const next = Math.min(100, cur + (target - cur) * lerpAmt)
      displayRef.current = next
      setDisplay(next)

      if (minOk && !isLoading && next >= 98.25) {
        finishedRef.current = true
        displayRef.current = 100
        setDisplay(100)
        scheduleHide()
        return true
      }
      return false
    }

    if (reduceMotion) {
      const interval = window.setInterval(() => {
        if (finishedRef.current || !showRef.current) return
        const elapsed = performance.now() - startedAtRef.current
        tickDisplay(elapsed)
      }, 100)
      return () => window.clearInterval(interval)
    }

    startedAtRef.current = performance.now()
    let raf = 0

    const tick = () => {
      if (finishedRef.current || !showRef.current) return
      const elapsed = performance.now() - startedAtRef.current
      if (tickDisplay(elapsed)) return
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [show, reduceMotion])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="portfolio-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#030303] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] font-sans text-white pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            filter: reduceMotion ? 'none' : 'blur(12px)',
            transition: { duration: reduceMotion ? 0.2 : 0.65, ease: EASE },
          }}
          aria-busy={!canDismiss}
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-[36%] h-[min(75vw,440px)] w-[min(75vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[110px]" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65" />
          </div>

          <motion.div
            className="relative flex w-full max-w-sm flex-col items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <BouncingDots
              backgroundColor="transparent"
              dotGradientStart="#818cf8"
              dotGradientEnd="#22d3ee"
              glowColor="rgba(129, 140, 248, 0.85)"
              rippleColor="rgba(34, 211, 238, 0.3)"
              shadowColor="rgba(99, 102, 241, 0.45)"
              dotSize={20}
              bounceHeight={40}
              dotSpacing={14}
              animationDuration={1.65}
              className="scale-95 sm:scale-100"
              style={{ paddingTop: 8, paddingBottom: 4, minHeight: 0 }}
            />

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={counterValue}
              aria-label="Loading progress"
              className="mt-1"
            >
              <LoaderCounter
                value={counterValue}
                to={100}
                suffix="%"
                color="#ffffff"
                suffixColor="#94a3b8"
                colorTransition
                startColor="#818cf8"
                endColor="#22d3ee"
                startOnView={false}
                font={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: 52,
                  letterSpacing: -0.04,
                  lineHeight: 1,
                  textAlign: 'center',
                }}
              />
            </div>

            <div className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                className="mt-4 min-h-[1.25rem] text-center text-[11px] font-medium tracking-wide text-neutral-400"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {status}
              </motion.p>
            </AnimatePresence>

            <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.38em] text-neutral-500">
              Moksh Sharma
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
