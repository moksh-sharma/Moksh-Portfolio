import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type FontConfig = {
  fontFamily?: string
  fontWeight?: number | string
  fontSize?: number
  letterSpacing?: number
  lineHeight?: number
  textAlign?: 'left' | 'center' | 'right'
}

export type LoaderCounterProps = {
  /** When set, displays this value directly (synced to external progress). */
  value?: number
  isLoader?: boolean
  from?: number
  to?: number
  duration?: boolean
  customDuration?: number
  delay?: number
  startOnView?: boolean
  replay?: boolean
  formatThousands?: boolean
  abbreviate?: boolean
  locale?: boolean
  customLocale?: string
  font?: FontConfig
  color?: string
  colorTransition?: boolean
  startColor?: string
  endColor?: string
  prefix?: string
  prefixColor?: string
  suffix?: string
  suffixColor?: string
  gap?: number
  style?: CSSProperties
  className?: string
}

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value))

function parseColor(color: string) {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const fullHex = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
    const bigint = parseInt(fullHex, 16)
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  }
  const match = color.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (match) {
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
  }
  return { r: 255, g: 255, b: 255 }
}

function interpolateColor(start: string, end: string, progress: number) {
  const from = parseColor(start)
  const to = parseColor(end)
  const r = Math.round(from.r + (to.r - from.r) * progress)
  const g = Math.round(from.g + (to.g - from.g) * progress)
  const b = Math.round(from.b + (to.b - from.b) * progress)
  return `rgb(${r}, ${g}, ${b})`
}

function getDecimalPlaces(num: number) {
  const str = String(num)
  const idx = str.indexOf('.')
  return idx >= 0 ? Math.min(3, str.length - idx - 1) : 0
}

function formatNumber(
  value: number,
  options: {
    thousands: boolean
    abbreviate: boolean
    locale: string
    decimals: number
  },
) {
  const { thousands, abbreviate, locale, decimals } = options
  const fixedValue = Number(value.toFixed(decimals))

  if (abbreviate) {
    const absValue = Math.abs(value)
    let divisor = 1
    let suffix = ''
    if (absValue >= 1e9) {
      divisor = 1e9
      suffix = 'B'
    } else if (absValue >= 1e6) {
      divisor = 1e6
      suffix = 'M'
    } else if (absValue >= 1e3) {
      divisor = 1e3
      suffix = 'K'
    }
    if (divisor > 1) {
      const scaled = value / divisor
      const text = scaled.toFixed(1).replace(/\.0$/, '')
      return `${value < 0 ? '-' : ''}${text}${suffix}`
    }
  }

  if (thousands) {
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
      }).format(fixedValue)
    } catch {
      return fixedValue.toString()
    }
  }

  return fixedValue.toString()
}

export default function LoaderCounter({
  value: controlledValue,
  isLoader = true,
  from = 0,
  to = 100,
  duration = false,
  customDuration = 3.2,
  delay = 0,
  startOnView = true,
  replay = false,
  formatThousands = false,
  abbreviate = false,
  locale = false,
  customLocale = 'en-US',
  font = {
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 600,
    fontSize: 56,
    letterSpacing: -0.02,
    lineHeight: 1,
    textAlign: 'center',
  },
  color = '#ffffff',
  colorTransition = false,
  startColor = '#818cf8',
  endColor = '#22d3ee',
  prefix = '',
  prefixColor = '#ffffff',
  suffix = '%',
  suffixColor = '#a5b4fc',
  gap = 4,
  style,
  className,
}: LoaderCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animatedValue, setAnimatedValue] = useState(from)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnView)

  const calculatedDuration = useMemo(() => {
    if (duration) return customDuration
    const range = Math.abs(to - from)
    if (isLoader) return clamp(3 + Math.log10(Math.max(1, range)) * 0.5, 3, 4.5)
    return clamp(1 + Math.log10(Math.max(1, range)) * 0.4, 1, 2.5)
  }, [duration, customDuration, from, to, isLoader])

  const resolvedLocale = useMemo(() => {
    if (!formatThousands) return 'en-US'
    if (!locale && typeof window !== 'undefined') {
      return window.navigator?.language || 'en-US'
    }
    return customLocale || 'en-US'
  }, [locale, customLocale, formatThousands])

  const decimals = useMemo(
    () => Math.max(getDecimalPlaces(from), getDecimalPlaces(to)),
    [from, to],
  )

  useEffect(() => {
    if (controlledValue !== undefined) return
    if (!startOnView) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
        else if (replay) {
          setIsVisible(false)
          setAnimatedValue(from)
          setProgress(0)
        }
      },
      { threshold: 0.1 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [controlledValue, startOnView, replay, from])

  useEffect(() => {
    if (controlledValue !== undefined) return
    if (!isVisible) return

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReducedMotion) {
      setAnimatedValue(to)
      setProgress(1)
      return
    }

    let raf = 0
    const startTime = performance.now() + delay * 1000
    const durationMs = calculatedDuration * 1000
    const range = to - from

    const animate = () => {
      const elapsed = performance.now() - startTime
      if (elapsed < 0) {
        raf = requestAnimationFrame(animate)
        return
      }
      const raw = clamp(elapsed / durationMs)
      setProgress(raw)
      setAnimatedValue(from + range * raw)
      if (raw < 1) raf = requestAnimationFrame(animate)
      else {
        setProgress(1)
        setAnimatedValue(to)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [controlledValue, isVisible, from, to, calculatedDuration, delay])

  const displayValue = controlledValue ?? animatedValue
  const displayProgress = controlledValue !== undefined ? clamp(displayValue / Math.max(1, to), 0, 1) : progress

  const formatted = formatNumber(displayValue, {
    thousands: formatThousands,
    abbreviate,
    locale: resolvedLocale,
    decimals,
  })

  const currentColor =
    colorTransition && startColor && endColor
      ? interpolateColor(startColor, endColor, displayProgress)
      : color

  const fontStyles = {
    fontFamily: font?.fontFamily || 'Outfit, sans-serif',
    fontWeight: font?.fontWeight || 600,
    fontSize: font?.fontSize || 56,
    letterSpacing: font?.letterSpacing ?? 0,
    lineHeight: font?.lineHeight || 1,
    textAlign: font?.textAlign || 'center',
  }

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`Loading: ${formatted}${suffix}`}
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent:
          fontStyles.textAlign === 'center'
            ? 'center'
            : fontStyles.textAlign === 'right'
              ? 'flex-end'
              : 'flex-start',
        ...fontStyles,
        ...style,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: prefix || suffix ? `${gap}px` : '0px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix ? (
          <span style={{ color: prefixColor }} aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <span style={{ color: currentColor, transition: 'color 0.35s ease' }}>{formatted}</span>
        {suffix ? (
          <span style={{ color: suffixColor }} aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  )
}
