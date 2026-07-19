import { Award, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { CERTIFICATIONS } from '../../data/certifications'

export function Certifications() {
  return (
    <section
      id="certifications"
      className="pointer-events-auto mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="pointer-events-auto text-center"
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-6xl">
          Certifications
        </h2>
        <p className="mx-auto mb-10 max-w-3xl px-1 text-base font-normal leading-relaxed text-white sm:mb-12 sm:text-lg md:text-xl">
          Professional certifications and job simulations in data analytics, project management, and software fundamentals.
        </p>
      </motion.div>

      <ul className="pointer-events-auto mx-auto flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        {CERTIFICATIONS.map((cert, i) => {
          const inner = (
            <>
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-200 sm:h-11 sm:w-11">
                <Award className="size-5 sm:size-[1.35rem]" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-balance text-base font-bold text-white sm:text-lg md:text-xl">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-indigo-200 sm:text-base">
                  {cert.issuer}
                  <span className="text-white/50"> · </span>
                  <span className="text-neutral-50">Certification</span>
                </p>
              </div>
              {cert.href && (
                <ExternalLink
                  className="mt-1 size-4 shrink-0 text-neutral-50 opacity-70 transition-opacity group-hover:opacity-100 sm:size-5"
                  aria-hidden
                />
              )}
            </>
          )

          return (
            <motion.li
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              {cert.href ? (
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex touch-manipulation items-start gap-3 rounded-xl border border-white/10 bg-[#0a0a0a]/80 p-4 shadow-xl backdrop-blur-xl transition-colors hover:border-indigo-500/40 hover:bg-white/[0.04] sm:gap-4 sm:rounded-2xl sm:p-5 md:p-6"
                >
                  {inner}
                </a>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0a0a0a]/80 p-4 shadow-xl backdrop-blur-xl sm:gap-4 sm:rounded-2xl sm:p-5 md:p-6">
                  {inner}
                </div>
              )}
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default Certifications
