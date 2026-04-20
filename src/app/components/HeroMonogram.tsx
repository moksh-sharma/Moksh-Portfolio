import React, { useEffect, useId, useState } from 'react'

/** Matches `bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400` (Tailwind v4 defaults) */
const INDIGO_400 = '#818cf8'
const CYAN_400 = '#22d3ee'

export type HeroMonogramProps = {
  /** Smaller card + SVG for secondary placements (e.g. footer). */
  compact?: boolean
}

export function HeroMonogram({ compact = false }: HeroMonogramProps) {
  const rawId = useId().replace(/:/g, '')
  const strokeGradId = `hero-ms-stroke-${rawId}`
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="relative isolate h-full min-h-0 w-full min-w-0">
      <style>{`
        .hero-ms-svg .hero-ms-path {
          stroke-dasharray: 4500;
          stroke-dashoffset: 4500;
        }
        .hero-ms-svg.hero-ms-svg--animate .hero-ms-path {
          animation: heroMsStrokeDraw 10s linear infinite;
        }
        @keyframes heroMsStrokeDraw {
          0% { stroke-dashoffset: 4500; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -4500; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ms-svg.hero-ms-svg--animate .hero-ms-path {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <div
        className={
          compact
            ? 'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[88%] w-[88%] max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[6px]'
            : 'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[92%] w-[92%] max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[40px] sm:blur-[48px] md:blur-[56px]'
        }
        style={{
          background: `radial-gradient(ellipse 50% 52% at 50% 50%, rgba(129, 140, 248, 0.4) 0%, rgba(34, 211, 238, 0.22) 42%, rgba(5, 5, 5, 0) 72%)`,
        }}
        aria-hidden
      />

      <div className="relative z-[1] flex h-full w-full items-center justify-center p-[2%]">
        <svg
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            compact
              ? 'hero-ms-svg hero-ms-svg--animate pointer-events-none aspect-square h-auto w-[min(96%,32px)] max-w-full'
              : 'hero-ms-svg hero-ms-svg--animate pointer-events-none aspect-square h-auto w-[min(82%,320px)] max-w-full sm:w-[min(82%,340px)] md:w-[min(84%,380px)] xl:w-[min(86%,400px)]'
          }
          aria-hidden
        >
          <defs>
            <linearGradient
              id={strokeGradId}
              gradientUnits="userSpaceOnUse"
              spreadMethod={reduceMotion ? 'pad' : 'repeat'}
              x1="0"
              y1="250"
              x2={reduceMotion ? 500 : 280}
              y2="250"
            >
              <stop offset="0%" stopColor={INDIGO_400} />
              <stop offset="50%" stopColor={CYAN_400} />
              <stop offset="100%" stopColor={INDIGO_400} />
              {!reduceMotion && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="0 0"
                  to="280 0"
                  dur="5.5s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              )}
            </linearGradient>
          </defs>
          <path
            className="hero-ms-path"
            d="M -1.369 499.067 L -1.369 2.068 L 194.679 2.068 L 248.813 305.066 L 302.583 2.068 L 500.458 2.068 L 500.458 499.067 L 382.682 499.067 L 382.682 141.002 L 308.798 499.067 C 314.922 283.183 201.788 196.95 193.217 499.067 L 114.944 141.002 L 114.944 499.067 L -1.369 499.067 Z"
            fill={`url(#${strokeGradId})`}
            fillOpacity={0.15}
            fillRule="nonzero"
            stroke={`url(#${strokeGradId})`}
            strokeWidth={20}
            strokeLinecap="square"
            strokeMiterlimit={1}
          />
        </svg>
      </div>
    </div>
  )
}

export default HeroMonogram
