import { motion, useReducedMotion } from 'framer-motion'
import { ROLES } from '../../data/roles'

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

const cardRevealReduced = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.35, delay: i * 0.04 },
  }),
}

function RoleCard({
  role,
  index,
  align,
  reducedMotion,
}: {
  role: { title: string; description: string }
  index: number
  align: 'left' | 'right'
  reducedMotion: boolean
}) {
  const num = String(index + 1).padStart(2, '0')
  const variants = reducedMotion ? cardRevealReduced : cardReveal

  return (
    <motion.article
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22, margin: '0px 0px -12% 0px' }}
      className={`group relative w-full min-w-0 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_-8px_rgba(168,85,247,0.35)] ${align === 'left' ? 'ml-0 mr-auto' : 'ml-auto mr-0'}`}
    >
      <div
        className="absolute right-0 top-0 h-32 w-32 opacity-30 transition-opacity group-hover:opacity-50"
        style={{
          background: 'radial-gradient(circle at 100% 0%, #a855f7 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative p-6 sm:p-8">
        <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[8rem] font-black leading-none text-violet-500/[0.08] sm:text-[10rem] md:text-[11rem]">
          {num}
        </span>
        <div className="relative z-[1]">
          <h3 className="mb-3 break-words pr-10 text-lg font-bold text-violet-300 sm:pr-14 sm:text-xl md:pr-20 md:text-2xl">
            {role.title}
          </h3>
          <p className="max-w-prose text-base leading-relaxed text-violet-100/90 sm:text-lg">{role.description}</p>
        </div>
      </div>
    </motion.article>
  )
}

export function RolesSection() {
  const reducedMotion = useReducedMotion() ?? false

  return (
    <section
      id="roles"
      className="pointer-events-auto mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto text-center"
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Roles</h2>
        <p className="mx-auto mb-10 max-w-3xl px-1 text-base font-light leading-relaxed text-neutral-400 sm:mb-12 sm:text-lg md:text-xl">
          Leadership positions and contributions to events and societies.
        </p>
      </motion.div>

      {/* Desktop: alternating cards + center spine — grid prevents side columns from shrinking */}
      <div className="relative mx-auto hidden w-full max-w-6xl md:block">
        <div
          className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent, #a855f7 10%, #ec4899 50%, #a855f7 90%, transparent)',
            opacity: 0.6,
          }}
          aria-hidden
        />
        <ul className="space-y-12 sm:space-y-16">
          {ROLES.map((role, index) => {
            const align = index % 2 === 0 ? 'left' : 'right'
            return (
              <li key={role.title} className="grid grid-cols-[1fr_4rem_1fr] items-center gap-x-0">
                <div className="flex min-w-0 justify-end pr-5 md:pr-8">
                  {align === 'left' && (
                    <RoleCard role={role} index={index} align="left" reducedMotion={reducedMotion} />
                  )}
                </div>
                <div
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center justify-self-center rounded-full border-2 border-violet-500 bg-[#0a0a0a] text-sm font-bold text-violet-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] md:h-16 md:w-16 md:text-base"
                  aria-hidden
                >
                  {index + 1}
                </div>
                <div className="flex min-w-0 justify-start pl-5 md:pl-8">
                  {align === 'right' && (
                    <RoleCard role={role} index={index} align="right" reducedMotion={reducedMotion} />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mobile */}
      <div className="relative mx-auto w-full max-w-2xl md:hidden">
        <div
          className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-violet-500 via-pink-500 to-transparent opacity-50"
          aria-hidden
        />
        <ul className="space-y-10">
          {ROLES.map((role, index) => (
            <li key={role.title} className="relative flex min-w-0 gap-4 pl-12 sm:gap-5 sm:pl-14">
              <div
                className="absolute left-0 top-6 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-500 bg-[#0a0a0a] text-sm font-bold text-violet-400 sm:h-12 sm:w-12 sm:text-base"
                aria-hidden
              >
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <RoleCard role={role} index={index} align="left" reducedMotion={reducedMotion} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RolesSection
