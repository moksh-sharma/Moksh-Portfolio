import { useRef, useEffect, useCallback, type VideoHTMLAttributes } from 'react'
import { useLenis } from 'lenis/react'
import { useScrollVideo } from '../context/ScrollVideoContext'
import { DESKTOP_VIDEO_FPS, MOBILE_VIDEO_FPS } from '../hooks/useDeviceScrollProfile'

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/background-scroll.mp4`
const WARMUP_STEPS = 8
const INIT_TIMEOUT_MS = 12000
const WARMUP_FRAME_BUDGET_MS = 3500

function detectVideoFps() {
  if (typeof window === 'undefined') return DESKTOP_VIDEO_FPS
  const isMobile =
    window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
  return isMobile ? MOBILE_VIDEO_FPS : DESKTOP_VIDEO_FPS
}

function isTimeSeekable(video: HTMLVideoElement, time: number): boolean {
  const ranges = video.seekable
  for (let i = 0; i < ranges.length; i++) {
    if (time >= ranges.start(i) && time <= ranges.end(i)) return true
  }
  return false
}

function waitForSeek(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve()
      return
    }
    const timeoutId = window.setTimeout(resolve, 80)
    video.addEventListener(
      'seeked',
      () => {
        window.clearTimeout(timeoutId)
        resolve()
      },
      { once: true },
    )
  })
}

function seekToTime(video: HTMLVideoElement, time: number): void {
  if (!isTimeSeekable(video, time)) return
  video.pause()
  if ('fastSeek' in video && typeof video.fastSeek === 'function') {
    video.fastSeek(time)
  } else {
    video.currentTime = time
  }
}

function readScrollMetrics() {
  const root = document.getElementById('portfolio-scroll')
  if (!root) return { progress: 0, ready: false }

  const maxScroll = root.scrollHeight - root.clientHeight
  if (maxScroll <= 0) return { progress: 0, ready: false }

  const progress = Math.min(1, Math.max(0, root.scrollTop / maxScroll))
  return { progress, ready: true }
}

function progressToFrameTime(progress: number, duration: number, fps: number): number {
  const clamped = Math.min(1, Math.max(0, progress))
  const totalFrames = Math.max(1, Math.round(duration * fps))
  const frameIndex = Math.min(totalFrames - 1, Math.floor(clamped * (totalFrames - 1)))
  return frameIndex / fps
}

async function fetchVideoBlob(
  src: string,
  onProgress: (ratio: number) => void,
  isCancelled: () => boolean,
): Promise<Blob | null> {
  try {
    const response = await fetch(src)
    if (!response.ok) return null

    const total = Number(response.headers.get('Content-Length'))
    if (!response.body || !Number.isFinite(total) || total <= 0) {
      onProgress(0.85)
      return response.blob()
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let received = 0

    while (true) {
      if (isCancelled()) return null
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      onProgress(Math.min(0.85, received / total))
    }

    return new Blob(chunks as BlobPart[], { type: 'video/mp4' })
  } catch {
    return null
  }
}

export function ScrollVideoBackground() {
  const { setProgress, setReady } = useScrollVideo()
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(0)
  const lastFrameRef = useRef(-1)
  const readyRef = useRef(false)
  const syncQueuedRef = useRef(false)
  const objectUrlRef = useRef<string | null>(null)
  const videoFpsRef = useRef(detectVideoFps())
  const lenis = useLenis()

  const applyFrameForProgress = useCallback((progress: number) => {
    const video = videoRef.current
    const duration = durationRef.current
    const fps = videoFpsRef.current
    if (!video || duration <= 0 || !readyRef.current) return

    const targetTime = progressToFrameTime(progress, duration, fps)
    const targetFrame = Math.round(targetTime * fps)

    if (targetFrame === lastFrameRef.current) return
    if (!isTimeSeekable(video, targetTime)) return

    lastFrameRef.current = targetFrame
    seekToTime(video, targetTime)
  }, [])

  const syncVideoToScroll = useCallback(() => {
    const { progress, ready } = readScrollMetrics()
    if (!ready) return
    applyFrameForProgress(progress)
  }, [applyFrameForProgress])

  const queueSync = useCallback(() => {
    if (syncQueuedRef.current) return
    syncQueuedRef.current = true
    requestAnimationFrame(() => {
      syncQueuedRef.current = false
      syncVideoToScroll()
    })
  }, [syncVideoToScroll])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false
    let finished = false

    const blockPlayback = () => {
      if (!video.paused) video.pause()
    }

    const blockPlayAttempt = (event: Event) => {
      event.preventDefault()
      blockPlayback()
    }

    const blockedPlay = () => Promise.resolve()
    const nativePlay = video.play.bind(video)
    video.play = blockedPlay

    video.addEventListener('play', blockPlayAttempt)
    video.addEventListener('playing', blockPlayback)
    video.addEventListener('contextmenu', blockPlayAttempt)

    const finishInit = () => {
      if (cancelled || finished) return
      finished = true

      lenis?.resize()
      video.pause()
      seekToTime(video, 0)
      lastFrameRef.current = -1
      readyRef.current = true
      setProgress(100)
      setReady(true)
      queueSync()
    }

    const warmup = async () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) {
        finishInit()
        return
      }

      durationRef.current = duration
      const fps = videoFpsRef.current
      const deadline = performance.now() + WARMUP_FRAME_BUDGET_MS

      for (let i = 0; i <= WARMUP_STEPS; i++) {
        if (cancelled || finished) return
        if (performance.now() >= deadline) break

        const t = progressToFrameTime(i / WARMUP_STEPS, duration, fps)
        seekToTime(video, t)
        await waitForSeek(video)
        setProgress(88 + (i / WARMUP_STEPS) * 10)
      }

      if (cancelled) return
      finishInit()
    }

    const onLoadedMetadata = () => {
      durationRef.current = video.duration
      video.pause()
      void warmup()
    }

    const init = async () => {
      setProgress(4)

      const blob = await fetchVideoBlob(
        VIDEO_SRC,
        (ratio) => setProgress(4 + ratio * 80),
        () => cancelled,
      )

      if (cancelled) return

      if (blob) {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = URL.createObjectURL(blob)
        video.src = objectUrlRef.current
      } else {
        video.src = VIDEO_SRC
      }

      setProgress(86)
      video.load()

      await new Promise<void>((resolve) => {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve()
          return
        }
        const onMeta = () => {
          video.removeEventListener('loadedmetadata', onMeta)
          video.removeEventListener('error', onErr)
          resolve()
        }
        const onErr = () => {
          video.removeEventListener('loadedmetadata', onMeta)
          video.removeEventListener('error', onErr)
          resolve()
        }
        video.addEventListener('loadedmetadata', onMeta)
        video.addEventListener('error', onErr)
      })

      if (cancelled) return

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        onLoadedMetadata()
      } else {
        finishInit()
      }
    }

    const initTimeoutId = window.setTimeout(() => {
      if (!finished) finishInit()
    }, INIT_TIMEOUT_MS)

    void init()

    return () => {
      cancelled = true
      window.clearTimeout(initTimeoutId)
      video.play = nativePlay
      video.removeEventListener('play', blockPlayAttempt)
      video.removeEventListener('playing', blockPlayback)
      video.removeEventListener('contextmenu', blockPlayAttempt)
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [setProgress, setReady, queueSync, lenis])

  useLenis(
    useCallback(() => {
      queueSync()
    }, [queueSync]),
    [],
    1,
  )

  useEffect(() => {
    const root = document.getElementById('portfolio-scroll')
    if (!root) return

    let touchActive = false
    let touchRaf = 0

    const touchLoop = () => {
      syncVideoToScroll()
      if (touchActive) touchRaf = requestAnimationFrame(touchLoop)
    }

    const onTouchStart = () => {
      touchActive = true
      if (!touchRaf) touchRaf = requestAnimationFrame(touchLoop)
    }

    const onTouchEnd = () => {
      touchActive = false
      if (touchRaf) cancelAnimationFrame(touchRaf)
      touchRaf = 0
      queueSync()
    }

    const onScroll = () => queueSync()

    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    root.addEventListener('touchcancel', onTouchEnd, { passive: true })
    root.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      touchActive = false
      if (touchRaf) cancelAnimationFrame(touchRaf)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchend', onTouchEnd)
      root.removeEventListener('touchcancel', onTouchEnd)
      root.removeEventListener('scroll', onScroll)
    }
  }, [syncVideoToScroll, queueSync])

  useEffect(() => {
    const root = document.getElementById('portfolio-scroll')
    if (!root || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      lenis?.resize()
      queueSync()
    })

    observer.observe(root)
    return () => observer.disconnect()
  }, [queueSync, lenis])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505] [contain:strict]">
      <video
        ref={videoRef}
        className="pointer-events-none h-full w-full scale-[1.02] object-cover select-none will-change-transform [transform:translate3d(0,0,0)] md:scale-105"
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        loop={false}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        {...({ fetchPriority: 'high' } as VideoHTMLAttributes<HTMLVideoElement>)}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply" />
    </div>
  )
}
