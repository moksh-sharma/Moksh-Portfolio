import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type DepthTiltProps = {
  children: ReactNode
  className?: string
  /** Max degrees of rotation on each axis (fine pointer / mouse only). */
  tiltAmount?: number
}

/**
 * Subtle 3D tilt following the pointer. Disabled for reduced motion and coarse pointers (touch).
 */
export function DepthTilt({ children, className = '', tiltAmount = 6 }: DepthTiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 320, damping: 30, mass: 0.35 })
  const springY = useSpring(rotateY, { stiffness: 320, damping: 30, mass: 0.35 })

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || !finePointer || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      rotateY.set(x * 2 * tiltAmount)
      rotateX.set(-y * 2 * tiltAmount)
    },
    [finePointer, reduced, rotateX, rotateY, tiltAmount],
  )

  const handleLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: reduced ? 0 : springX,
        rotateY: reduced ? 0 : springY,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
