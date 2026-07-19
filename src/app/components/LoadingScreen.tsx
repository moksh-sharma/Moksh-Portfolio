import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const MIN_VISIBLE_MS = 1100
const RAMP_MS = 2600
const LERP = 0.07

const STATUS_LINES = [
  'BOOT // PORTFOLIO KERNEL',
  'MOUNT // SCROLL FRAMEBUFFER',
  'SYNC // ASSET PIPELINE',
  'CALIBRATE // RENDER PATH',
]

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function easeOutCubic(t: number) {
  return 1 - (1 - clamp(t, 0, 1)) ** 3
}

type LoadingScreenProps = {
  progress?: number
  active?: boolean
}

export function LoadingScreen({ progress = 0, active = true }: LoadingScreenProps) {
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

  const pct = clamp(display, 0, 100)
  const statusIndex = Math.min(
    STATUS_LINES.length - 1,
    Math.floor((pct / 100) * STATUS_LINES.length),
  )

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
        window.setTimeout(() => setShow(false), 280)
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
          className="pointer-events-auto fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#050505] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] font-sans text-white"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] as const },
          }}
          aria-busy="true"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Grid + scanline atmosphere */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)',
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.18)_0%,transparent_55%)]" aria-hidden />

          <div className="pointer-events-none relative z-[1] flex w-full max-w-md flex-col items-center gap-8 px-4 sm:gap-10">
            {/* HUD frame */}
            <div className="relative w-full rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md sm:p-8">
              <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-cyan-400/70" aria-hidden />
              <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-indigo-400/70" aria-hidden />
              <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-indigo-400/70" aria-hidden />
              <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-cyan-400/70" aria-hidden />

              <div className="flex flex-col items-center gap-6">
                <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
                  {!reduceMotion && (
                    <>
                      <motion.span
                        className="absolute inset-0 rounded-full border border-indigo-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.span
                        className="absolute inset-[10px] rounded-full border border-dashed border-cyan-400/25"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'conic-gradient(from 0deg, transparent 0%, rgba(129,140,248,0.45) 28%, rgba(34,211,238,0.35) 48%, transparent 62%)',
                          maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
                          WebkitMaskImage:
                            'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      />
                    </>
                  )}
                  <div className="relative z-[1] grid h-[4.25rem] w-[4.25rem] place-items-center rounded-xl border border-white/15 bg-[#0a0a0a]/90 md:h-[4.75rem] md:w-[4.75rem]">
                    <span className="font-mono text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-white to-cyan-300 md:text-2xl">
                      MS
                    </span>
                  </div>
                </div>

                <div className="w-full text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-300/80 sm:text-[11px]">
                    System init
                  </p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                    <span className="bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent">
                      Moksh Sharma
                    </span>
                  </h1>
                  <p className="mt-2 font-mono text-[11px] text-neutral-400 sm:text-xs">
                    {pct < 99.5 ? STATUS_LINES[statusIndex] : 'STATUS // READY'}
                    {!reduceMotion && pct < 99.5 && (
                      <motion.span
                        className="ml-1 inline-block text-cyan-300"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      >
                        _
                      </motion.span>
                    )}
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-end justify-between gap-3 font-mono text-[11px] tabular-nums text-neutral-400 sm:text-xs">
                    <span className="text-indigo-200/90">FRAMES</span>
                    <span className="text-white">{pct < 99.5 ? `${Math.round(pct).toString().padStart(3, '0')}%` : '100%'}</span>
                  </div>

                  {/* Segmented tech bar */}
                  <div
                    className="grid gap-0.5 sm:gap-1"
                    style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                  >
                    {Array.from({ length: 20 }, (_, i) => {
                      const filled = pct >= ((i + 1) / 20) * 100
                      const partial = !filled && pct > (i / 20) * 100
                      return (
                        <div
                          key={i}
                          className={`h-2 rounded-[1px] transition-colors duration-150 sm:h-2.5 ${filled
                              ? 'bg-gradient-to-r from-indigo-400 to-cyan-400'
                              : partial
                                ? 'bg-indigo-400/50'
                                : 'bg-white/10'
                            }`}
                        />
                      )
                    })}
                  </div>

                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                    <span>0x00</span>
                    <span>{pct < 99.5 ? 'loading sequence' : 'handshake ok'}</span>
                    <span>0xFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
