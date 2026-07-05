import { useRef, useEffect, useCallback, type VideoHTMLAttributes } from 'react'
import { useLenis } from 'lenis/react'
import { useScrollVideo } from '../context/ScrollVideoContext'

const VIDEO_SRC = '/videos/background-scroll.mp4'
const VIDEO_FPS = 60000 / 1001
const WARMUP_STEPS = 24
const MIN_SCROLL_RANGE_RATIO = 2
const MIN_BUFFER_RATIO = 0.9
const BUFFER_WAIT_MS = 90000
const SEEK_RETRY_MS = 300
const SEEK_MAX_ATTEMPTS = 12

function getBufferedRatio(video: HTMLVideoElement): number {
  const duration = video.duration
  if (!Number.isFinite(duration) || duration <= 0) return 0

  let bufferedEnd = 0
  for (let i = 0; i < video.buffered.length; i++) {
    bufferedEnd = Math.max(bufferedEnd, video.buffered.end(i))
  }
  return bufferedEnd / duration
}

async function waitForBufferedCoverage(
  video: HTMLVideoElement,
  minRatio: number,
  timeoutMs: number,
  onProgress?: (ratio: number) => void,
  isCancelled?: () => boolean,
): Promise<boolean> {
  const startedAt = performance.now()

  return new Promise((resolve) => {
    const finish = (ok: boolean) => {
      video.removeEventListener('progress', tick)
      resolve(ok)
    }

    const tick = () => {
      if (isCancelled?.()) {
        finish(false)
        return
      }

      const ratio = getBufferedRatio(video)
      onProgress?.(ratio)

      if (ratio >= minRatio) {
        finish(true)
        return
      }

      if (performance.now() - startedAt >= timeoutMs) {
        finish(ratio >= minRatio * 0.75)
        return
      }

      requestAnimationFrame(tick)
    }

    video.addEventListener('progress', tick)
    tick()
  })
}

function isTimeSeekable(video: HTMLVideoElement, time: number): boolean {
  const ranges = video.seekable
  for (let i = 0; i < ranges.length; i++) {
    if (time >= ranges.start(i) && time <= ranges.end(i)) return true
  }
  return false
}

async function seekToTime(video: HTMLVideoElement, time: number): Promise<boolean> {
  for (let attempt = 0; attempt < SEEK_MAX_ATTEMPTS; attempt++) {
    if (isTimeSeekable(video, time)) {
      video.pause()
      if ('fastSeek' in video && typeof video.fastSeek === 'function') {
        video.fastSeek(time)
      } else {
        video.currentTime = time
      }
      await waitForSeek(video)
      return true
    }

    await new Promise<void>((resolve) => {
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        video.removeEventListener('progress', done)
        window.clearTimeout(timeoutId)
        resolve()
      }
      const timeoutId = window.setTimeout(done, SEEK_RETRY_MS)
      video.addEventListener('progress', done, { once: true })
    })
  }

  return false
}

function waitForSeek(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve()
      return
    }
    video.addEventListener('seeked', () => resolve(), { once: true })
  })
}

function readScrollMetrics() {
  const root = document.getElementById('portfolio-scroll')
  if (!root) {
    return { scrollTop: 0, maxScroll: 0, progress: 0, ready: false }
  }

  const maxScroll = root.scrollHeight - root.clientHeight
  const ready = maxScroll >= window.innerHeight * MIN_SCROLL_RANGE_RATIO

  if (maxScroll <= 0 || !ready) {
    return { scrollTop: root.scrollTop, maxScroll, progress: 0, ready: false }
  }

  const progress = Math.min(1, Math.max(0, root.scrollTop / maxScroll))
  return { scrollTop: root.scrollTop, maxScroll, progress, ready: true }
}

function progressToFrameTime(progress: number, duration: number): number {
  const clamped = Math.min(1, Math.max(0, progress))
  const totalFrames = Math.max(1, Math.round(duration * VIDEO_FPS))
  const frameIndex = Math.min(totalFrames - 1, Math.floor(clamped * (totalFrames - 1)))
  return frameIndex / VIDEO_FPS
}

async function waitForScrollLayout(): Promise<void> {
  for (let i = 0; i < 60; i++) {
    if (readScrollMetrics().ready) return
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  }
}

export function ScrollVideoBackground() {
  const { setProgress, setReady } = useScrollVideo()
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(0)
  const lastFrameRef = useRef(-1)
  const readyRef = useRef(false)
  const lenis = useLenis()

  const applyFrameForProgress = useCallback((progress: number) => {
    const video = videoRef.current
    const duration = durationRef.current
    if (!video || duration <= 0 || !readyRef.current) return

    const targetTime = progressToFrameTime(progress, duration)
    const targetFrame = Math.round(targetTime * VIDEO_FPS)

    if (targetFrame === lastFrameRef.current) return
    if (!isTimeSeekable(video, targetTime)) return

    lastFrameRef.current = targetFrame

    video.pause()

    if ('fastSeek' in video && typeof video.fastSeek === 'function') {
      video.fastSeek(targetTime)
    } else {
      video.currentTime = targetTime
    }
  }, [])

  const syncVideoToScroll = useCallback(() => {
    const { progress, ready } = readScrollMetrics()
    if (!ready) return
    applyFrameForProgress(progress)
  }, [applyFrameForProgress])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false
    let warmupStarted = false

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

    const updateBufferProgress = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return
      const pct = Math.min(72, getBufferedRatio(video) * 72)
      setProgress(Math.max(8, pct))
    }

    const warmup = async () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) return

      setProgress(10)
      await waitForBufferedCoverage(
        video,
        0.2,
        BUFFER_WAIT_MS,
        (ratio) => setProgress(Math.max(10, Math.min(68, ratio * 68))),
        () => cancelled,
      )
      if (cancelled) return

      for (let i = 0; i <= WARMUP_STEPS; i++) {
        if (cancelled) return
        const t = progressToFrameTime(i / WARMUP_STEPS, duration)
        await seekToTime(video, t)
        setProgress(72 + (i / WARMUP_STEPS) * 18)
      }

      if (cancelled) return

      setProgress(92)
      await waitForBufferedCoverage(
        video,
        MIN_BUFFER_RATIO,
        BUFFER_WAIT_MS,
        (ratio) => setProgress(Math.max(92, Math.min(97, 92 + ratio * 5))),
        () => cancelled,
      )
      if (cancelled) return

      setProgress(97)
      await waitForScrollLayout()
      if (cancelled) return

      lenis?.resize()

      video.pause()
      await seekToTime(video, 0)
      lastFrameRef.current = -1
      readyRef.current = true
      setProgress(100)
      setReady(true)
      syncVideoToScroll()
    }

    const onLoadedMetadata = () => {
      if (warmupStarted) return
      warmupStarted = true

      durationRef.current = video.duration
      video.pause()
      setProgress(8)
      updateBufferProgress()
      void warmup()
    }

    const onProgress = () => {
      if (!readyRef.current) updateBufferProgress()
    }

    const onError = () => {
      readyRef.current = true
      setReady(true)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('progress', onProgress)
    video.addEventListener('error', onError)

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onLoadedMetadata()
    }

    return () => {
      cancelled = true
      video.play = nativePlay
      video.removeEventListener('play', blockPlayAttempt)
      video.removeEventListener('playing', blockPlayback)
      video.removeEventListener('contextmenu', blockPlayAttempt)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('error', onError)
    }
  }, [setProgress, setReady, syncVideoToScroll, lenis])

  useLenis(
    useCallback(() => {
      syncVideoToScroll()
    }, [syncVideoToScroll]),
    [],
    1,
  )

  useEffect(() => {
    const root = document.getElementById('portfolio-scroll')
    if (!root) return

    const onScroll = () => syncVideoToScroll()
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [syncVideoToScroll])

  useEffect(() => {
    const root = document.getElementById('portfolio-scroll')
    if (!root || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      lenis?.resize()
      syncVideoToScroll()
    })

    observer.observe(root)
    const content = root.firstElementChild
    if (content) observer.observe(content)

    return () => observer.disconnect()
  }, [syncVideoToScroll, lenis])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="pointer-events-none h-full w-full scale-105 object-cover select-none"
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
