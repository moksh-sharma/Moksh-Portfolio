import { useEffect, useRef } from 'react'
import { SCROLL_FRAME_COUNT, scrollFrameUrl } from '../../data/scrollFrames'

export type FrameLoadState = {
  progress: number
  active: boolean
}

type ScrollFrameBackgroundProps = {
  onLoadProgress?: (state: FrameLoadState) => void
}

const PRELOAD_CONCURRENCY = 10
/** Desktop scrub follow strength (frame-rate independent). */
const SCRUB_LAMBDA_DESKTOP = 14
/** Slightly snappier on touch so scrub keeps up with finger momentum. */
const SCRUB_LAMBDA_TOUCH = 18
const SCROLL_EPS = 0.35

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

async function preloadFrames(
  onProgress: (loaded: number, total: number) => void,
): Promise<HTMLImageElement[]> {
  const total = SCROLL_FRAME_COUNT
  const images: HTMLImageElement[] = new Array(total)
  let nextIndex = 0
  let loaded = 0

  const worker = async () => {
    while (true) {
      const i = nextIndex++
      if (i >= total) return
      images[i] = await loadImage(scrollFrameUrl(i + 1))
      loaded += 1
      onProgress(loaded, total)
    }
  }

  await Promise.all(Array.from({ length: PRELOAD_CONCURRENCY }, () => worker()))
  return images
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const ir = img.naturalWidth / img.naturalHeight
  const cr = width / height
  let dw: number
  let dh: number
  let dx: number
  let dy: number
  if (ir > cr) {
    dh = height
    dw = height * ir
    dx = (width - dw) / 2
    dy = 0
  } else {
    dw = width
    dh = width / ir
    dx = 0
    dy = (height - dh) / 2
  }
  ctx.drawImage(img, dx, dy, dw, dh)
}

function measureScrollMetrics() {
  const el = document.getElementById('portfolio-scroll')
  if (el) {
    return {
      scrollTop: el.scrollTop,
      maxScroll: Math.max(1, el.scrollHeight - el.clientHeight),
    }
  }
  return {
    scrollTop: window.scrollY,
    maxScroll: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
  }
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

export function ScrollFrameBackground({ onLoadProgress }: ScrollFrameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[] | null>(null)
  const targetFrameRef = useRef(0)
  const currentFrameRef = useRef(0)
  const drawnFrameRef = useRef(-1)
  const reduceMotionRef = useRef(false)
  const onLoadProgressRef = useRef(onLoadProgress)
  onLoadProgressRef.current = onLoadProgress

  // Scrub from absolute scrollTop; denominator frozen so accordion
  // height changes do not retarget frames.
  const baselineMaxScrollRef = useRef(1)
  const lastScrollTopRef = useRef(0)
  const scrollProgressRef = useRef(0)
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0)
  const scrubLambdaRef = useRef(SCRUB_LAMBDA_DESKTOP)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotionRef.current = mq.matches
    const onChange = () => {
      reduceMotionRef.current = mq.matches
    }
    mq.addEventListener('change', onChange)
    scrubLambdaRef.current = isCoarsePointer() ? SCRUB_LAMBDA_TOUCH : SCRUB_LAMBDA_DESKTOP
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const refreshBaseline = (force = false) => {
      const w = window.innerWidth
      // iOS URL-bar show/hide changes height only — ignore those.
      if (!force && Math.abs(w - lastWidthRef.current) < 10 && baselineMaxScrollRef.current > 1) {
        return
      }
      lastWidthRef.current = w
      const { scrollTop, maxScroll } = measureScrollMetrics()
      baselineMaxScrollRef.current = maxScroll
      lastScrollTopRef.current = scrollTop
      scrollProgressRef.current = Math.min(1, Math.max(0, scrollTop / maxScroll))
      scrubLambdaRef.current = isCoarsePointer() ? SCRUB_LAMBDA_TOUCH : SCRUB_LAMBDA_DESKTOP
    }

    refreshBaseline(true)
    const t1 = window.setTimeout(() => refreshBaseline(true), 120)
    const t2 = window.setTimeout(() => refreshBaseline(true), 700)

    const onResize = () => refreshBaseline(false)
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    onLoadProgressRef.current?.({ progress: 0, active: true })

    preloadFrames((loaded, total) => {
      if (cancelled) return
      onLoadProgressRef.current?.({
        progress: (loaded / total) * 100,
        active: loaded < total,
      })
    })
      .then((images) => {
        if (cancelled) return
        imagesRef.current = images
        onLoadProgressRef.current?.({ progress: 100, active: false })
        drawnFrameRef.current = -1
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) onLoadProgressRef.current?.({ progress: 100, active: false })
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const syncSize = () => {
      const coarse = isCoarsePointer()
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d', { alpha: false })
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.imageSmoothingEnabled = true
      }
      drawnFrameRef.current = -1
    }

    syncSize()
    window.addEventListener('resize', syncSize)

    const readScrollProgress = () => {
      const { scrollTop } = measureScrollMetrics()
      if (Math.abs(scrollTop - lastScrollTopRef.current) < SCROLL_EPS) {
        return scrollProgressRef.current
      }
      lastScrollTopRef.current = scrollTop
      const max = baselineMaxScrollRef.current
      scrollProgressRef.current = Math.min(1, Math.max(0, scrollTop / max))
      return scrollProgressRef.current
    }

    let raf = 0
    let lastTs = performance.now()

    const tick = (ts: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000))
      lastTs = ts

      const progress = readScrollProgress()
      const maxIndex = SCROLL_FRAME_COUNT - 1
      targetFrameRef.current = progress * maxIndex

      if (reduceMotionRef.current) {
        currentFrameRef.current = targetFrameRef.current
      } else {
        const lambda = scrubLambdaRef.current
        const alpha = 1 - Math.exp(-lambda * dt)
        const cur = currentFrameRef.current
        const target = targetFrameRef.current
        currentFrameRef.current = cur + (target - cur) * alpha
        if (Math.abs(target - currentFrameRef.current) < 0.02) {
          currentFrameRef.current = target
        }
      }

      const images = imagesRef.current
      const ctx = canvas.getContext('2d')
      if (images && ctx) {
        const index = Math.round(currentFrameRef.current)
        const clamped = Math.min(maxIndex, Math.max(0, index))
        if (clamped !== drawnFrameRef.current) {
          const img = images[clamped]
          if (img?.complete) {
            const w = window.innerWidth
            const h = window.innerHeight
            ctx.fillStyle = '#050505'
            ctx.fillRect(0, 0, w, h)
            drawCover(ctx, img, w, h)
            drawnFrameRef.current = clamped
          }
        }
      }

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncSize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
    </div>
  )
}
