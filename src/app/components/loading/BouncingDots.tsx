import type { CSSProperties } from 'react'

export type BouncingDotsProps = {
  dotCount?: number
  dotSize?: number
  bounceHeight?: number
  animationDuration?: number
  dotSpacing?: number
  showRipple?: boolean
  showShadow?: boolean
  backgroundColor?: string
  dotGradientStart?: string
  dotGradientEnd?: string
  glowColor?: string
  rippleColor?: string
  shadowColor?: string
  style?: CSSProperties
  className?: string
}

export default function BouncingDots({
  dotCount = 4,
  dotSize = 24,
  bounceHeight = 50,
  animationDuration = 1.4,
  dotSpacing = 16,
  showRipple = true,
  showShadow = true,
  backgroundColor = 'transparent',
  dotGradientStart = '#818cf8',
  dotGradientEnd = '#22d3ee',
  glowColor = 'rgba(129, 140, 248, 0.85)',
  rippleColor = 'rgba(34, 211, 238, 0.35)',
  shadowColor = 'rgba(129, 140, 248, 0.45)',
  style,
  className,
}: BouncingDotsProps) {
  const containerHeight = bounceHeight + dotSize + 40

  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: containerHeight + 64,
        padding: 32,
        overflow: 'visible',
        backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: dotSpacing,
          alignItems: 'flex-end',
          height: containerHeight,
        }}
      >
        {Array.from({ length: dotCount }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              width: dotSize + 4,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: dotSize,
                height: dotSize,
                zIndex: 10,
                animation: `gravity-bounce ${animationDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                animationDelay: `${i * 0.15}s`,
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `linear-gradient(to bottom, ${dotGradientStart}, ${dotGradientEnd})`,
                  boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(/[\d.]+\)$/g, '0.4)')}`,
                  animation: `rubber-morph ${animationDuration}s linear infinite`,
                  animationDelay: `${i * 0.15}s`,
                  willChange: 'transform',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  width: 6,
                  height: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
            {showRipple && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: dotSize * 2,
                  height: 12,
                  border: `1px solid ${rippleColor}`,
                  borderRadius: '100%',
                  opacity: 0,
                  animation: `ripple-expand ${animationDuration}s linear infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            )}
            {showShadow && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  width: dotSize,
                  height: 6,
                  borderRadius: '100%',
                  backgroundColor: shadowColor,
                  filter: 'blur(4px)',
                  animation: `shadow-breathe ${animationDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes gravity-bounce {
          0% { transform: translateY(0); animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1); }
          50% { transform: translateY(-${bounceHeight}px); animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0); }
          100% { transform: translateY(0); }
        }
        @keyframes rubber-morph {
          0% { transform: scale(1.4, 0.6); }
          5% { transform: scale(0.9, 1.1); }
          15% { transform: scale(1, 1); }
          50% { transform: scale(1, 1); }
          85% { transform: scale(0.9, 1.1); }
          100% { transform: scale(1.4, 0.6); }
        }
        @keyframes shadow-breathe {
          0% { transform: scale(1.4); opacity: 0.6; }
          50% { transform: scale(0.5); opacity: 0.1; }
          100% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes ripple-expand {
          0% { transform: scale(0.5); opacity: 0; border-width: 4px; }
          5% { opacity: 0.8; }
          30% { transform: scale(1.5); opacity: 0; border-width: 0px; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
