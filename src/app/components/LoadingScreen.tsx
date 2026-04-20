import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useProgress } from '@react-three/drei'

const MIN_VISIBLE_MS = 1000
const RAMP_MS = 2400
const LERP = 0.06

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function easeOutCubic(t: number) {
  return 1 - (1 - clamp(t, 0, 1)) ** 3
}

export function LoadingScreen() {
  const { active, progress } = useProgress()
  const reduceMotion = useReducedMotion() ?? false
  const [minElapsed, setMinElapsed] = useState(false)
  const [show, setShow] = useState(true)
  const [display, setDisplay] = useState(0)

  const progressRef = useRef(progress)
  const activeRef = useRef(active)
  const minElapsedRef = useRef(minElapsed)
  const showRef = useRef(show)
  const displayRef = useRef(0)
  const startedAtRef = useRef(performance.now())
  const finishedRef = useRef(false)

  progressRef.current = progress
  activeRef.current = active
  minElapsedRef.current = minElapsed
  showRef.current = show

  useEffect(() => {
    const t = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!reduceMotion) return
    if (!show || finishedRef.current) return

    const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 100)
    if (minElapsed && !active) {
      finishedRef.current = true
      displayRef.current = 100
      setDisplay(100)
      const hide = window.setTimeout(() => setShow(false), 150)
      return () => window.clearTimeout(hide)
    }
    displayRef.current = p
    setDisplay(p)
  }, [reduceMotion, show, minElapsed, active, progress])

  useEffect(() => {
    if (reduceMotion || !show || finishedRef.current) return

    startedAtRef.current = performance.now()
    let raf = 0

    const tick = () => {
      if (finishedRef.current || !showRef.current) return

      const elapsed = performance.now() - startedAtRef.current
      const u = Math.min(1, elapsed / RAMP_MS)
      const eased = easeOutCubic(u) * 100

      const p = clamp(Number.isFinite(progressRef.current) ? progressRef.current : 0, 0, 100)
      const isActive = activeRef.current
      const minOk = minElapsedRef.current

      let target: number
      if (minOk && !isActive) {
        target = 100
      } else if (isActive) {
        target = Math.max(p, eased * 0.94)
      } else {
        target = Math.max(p, eased)
      }

      const cur = displayRef.current
      const closing = minOk && !isActive
      const lerpAmt = closing ? 0.22 : LERP
      const next = Math.min(100, cur + (target - cur) * lerpAmt)
      displayRef.current = next
      setDisplay(next)

      if (minOk && !isActive && next >= 98.25) {
        finishedRef.current = true
        displayRef.current = 100
        setDisplay(100)
        window.setTimeout(() => setShow(false), 220)
        return
      }

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [show, reduceMotion])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="portfolio-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] font-sans text-white pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] as const },
          }}
          aria-busy="true"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none flex flex-col items-center gap-10 px-6">
            <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
              {!reduceMotion && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/25"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    className="absolute inset-2 rounded-full border border-cyan-400/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'conic-gradient(from 0deg, transparent 0%, rgba(129,140,248,0.35) 40%, rgba(34,211,238,0.25) 60%, transparent 100%)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                  />
                </>
              )}
              <div className="relative z-[1] grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-black/40 shadow-[0_0_40px_-8px_rgba(129,140,248,0.45)] backdrop-blur-sm md:h-[4.5rem] md:w-[4.5rem]">
                <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-cyan-300 md:text-xl">
                  MS
                </span>
              </div>
            </div>

            <div className="text-center">
              <motion.h1
                className="text-2xl font-bold tracking-tight text-white md:text-4xl"
                initial={false}
                animate={
                  reduceMotion
                    ? {}
                    : { opacity: [0.85, 1, 0.85], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }
                }
              >
                <span className="bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  Moksh Sharma
                </span>
              </motion.h1>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500 md:text-sm">
                Portfolio
              </p>
            </div>

            <div className="w-[min(100%,280px)] space-y-2 md:w-80">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                  style={{ width: `${clamp(display, 0, 100)}%` }}
                />
              </div>
              <p className="text-center font-mono text-[11px] tabular-nums text-neutral-500 md:text-xs">
                {display < 99.5 ? `${Math.round(display)}%` : 'Ready'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
