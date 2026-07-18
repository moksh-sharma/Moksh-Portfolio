import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Fragment, useState } from 'react'
import { EXPERIENCE_ENTRIES } from '../../data/experience'

const expDetailContainerVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
}

const expDetailItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const expBulletGroupVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
}

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      id="experience"
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pointer-events-auto w-full"
      >
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Experience</h2>
          <p className="mx-auto max-w-3xl px-1 text-base font-light leading-relaxed text-neutral-400 sm:text-lg md:text-xl">
            Internships and roles where I&apos;ve built products and grown as a developer.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-[18px_minmax(0,1fr)] gap-x-3 gap-y-4 sm:grid-cols-[22px_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-5 md:grid-cols-[26px_minmax(0,1fr)] md:gap-x-5 md:gap-y-5">
          {EXPERIENCE_ENTRIES.map((item, i) => {
            const open = openId === item.id
            const headline = `${item.role}, ${item.company}`
            const isLast = i === EXPERIENCE_ENTRIES.length - 1
            const isFirst = i === 0
            return (
              <Fragment key={item.id}>
                <div className="relative flex w-full justify-center justify-self-center">
                  {/* Timeline spine: continuous through gaps (extends into gap-y-5) */}
                  <div
                    className={`pointer-events-none absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-indigo-500/45 via-white/18 to-cyan-500/35 ${isFirst ? 'top-0' : 'top-[-1.25rem]'} ${isLast ? 'bottom-0' : 'bottom-[-1.25rem]'}`}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute left-1/2 top-7 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-visible md:top-8"
                    aria-hidden
                  >
                    <span className="absolute h-7 w-7 rounded-full bg-indigo-500/35 blur-md motion-reduce:opacity-0 motion-reduce:blur-0" />
                    <span className="absolute h-5 w-5 rounded-full bg-cyan-400/25 blur-sm motion-reduce:opacity-0 motion-reduce:blur-0" />
                    <span className="absolute inline-flex h-full w-full motion-reduce:hidden">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400/40 [animation-duration:2.4s]" />
                    </span>
                    <span className="relative h-4 w-4 rounded-full border-2 border-[#050505] bg-gradient-to-br from-indigo-400 via-indigo-300 to-cyan-400 shadow-[0_0_10px_rgba(129,140,248,0.95),0_0_20px_rgba(34,211,238,0.55),0_0_32px_rgba(129,140,248,0.35)]" />
                  </div>
                </div>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.05, layout: { type: 'spring', bounce: 0.2, duration: 0.45 } }}
                  className={`min-w-0 rounded-2xl border bg-[#0a0a0a]/80 backdrop-blur-xl shadow-xl transition-colors ${open ? 'border-indigo-500/40 bg-white/[0.04]' : 'border-white/10 hover:border-white/20'}`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`experience-panel-${item.id}`}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full touch-manipulation items-start justify-between gap-3 p-4 text-left sm:gap-4 sm:p-5 md:p-6"
                  >
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-balance tracking-tight transition-[font-size,font-weight,color] duration-300 ease-out ${open
                          ? 'text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 sm:text-2xl md:text-3xl'
                          : 'text-lg font-bold text-white md:text-xl'
                          }`}
                      >
                        {headline}
                      </h3>
                      {!open && (
                        <p className="mt-1 text-sm font-medium text-indigo-400/90">{item.period}</p>
                      )}
                      {!open && (
                        <p className="mt-0.5 text-xs text-neutral-500 md:text-sm">{item.location}</p>
                      )}
                      {!open && (
                        <p className="mt-2 text-sm text-neutral-500 font-light">Click to view details</p>
                      )}
                    </div>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      className={`inline-flex shrink-0 ${open ? 'text-indigo-400' : 'text-neutral-500'}`}
                      aria-hidden
                    >
                      <ChevronDown size={22} />
                    </motion.span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="min-h-0">
                      <motion.div
                        id={`experience-panel-${item.id}`}
                        role="region"
                        aria-hidden={!open}
                        variants={expDetailContainerVariants}
                        initial={false}
                        animate={open ? 'visible' : 'hidden'}
                        className={`border-t border-white/10 px-5 pb-6 pt-2 md:px-6 md:pb-6 ${open ? '' : 'pointer-events-none'}`}
                      >
                        <motion.p
                          variants={expDetailItemVariants}
                          className="text-sm font-medium tracking-wide text-indigo-400 md:text-base"
                        >
                          {item.period}
                        </motion.p>
                        <motion.p
                          variants={expDetailItemVariants}
                          className="mt-1 text-xs text-neutral-500 md:text-sm"
                        >
                          {item.location}
                        </motion.p>
                        <motion.div variants={expBulletGroupVariants} className="mt-4 space-y-3">
                          {item.bullets.map((line, bi) => (
                            <motion.p
                              key={bi}
                              variants={expDetailItemVariants}
                              className="relative pl-5 text-[15px] font-light leading-relaxed text-neutral-300 md:text-base before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/70"
                            >
                              {line}
                            </motion.p>
                          ))}
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Fragment>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default Experience
