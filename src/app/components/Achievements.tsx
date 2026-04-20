import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Award, CheckCircle2, LayoutTemplate } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel'
import { ACHIEVEMENT_SLIDES } from '../../data/achievementsSlides'

const slideShell =
  'group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04] sm:min-h-[300px] sm:rounded-[2.5rem] sm:p-8 md:min-h-[360px] md:p-12'

const slideBackground = (
  <>
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] transition-all duration-500 group-hover:bg-indigo-500/20" />
    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] transition-all duration-500 group-hover:bg-cyan-500/20" />
  </>
)

export function Achievements() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    setCurrent(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('reInit', onSelect)
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <section
      id="achievements"
      className="pointer-events-auto relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Achievements</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-neutral-400 md:text-lg">
          Certifications, skills, and credentials I&apos;ve earned along the way.
        </p>
      </motion.div>

      <div className="relative mx-auto mt-12 w-full max-w-3xl md:mt-16">
        <Carousel opts={{ loop: true, align: 'start' }} setApi={setApi} className="relative w-full">
          <CarouselContent>
            {ACHIEVEMENT_SLIDES.map((slide, index) => (
              <CarouselItem key={slide.kind + String(index)} className="basis-full">
                {slide.kind === 'deloitte' && (
                  <div className={slideShell}>
                    {slideBackground}
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                          <Award size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white md:text-3xl">{slide.title}</h3>
                          <p className="mt-1 text-sm font-medium text-indigo-400 md:text-base">{slide.subtitle}</p>
                        </div>
                      </div>
                      <ul className="mt-8 flex-1 space-y-4 text-left text-sm leading-relaxed text-neutral-300 md:text-base">
                        {slide.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400/80" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={slide.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-6 py-3 text-sm font-semibold text-indigo-200 transition-all hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      >
                        <ExternalLink className="size-4 shrink-0" aria-hidden />
                        View certificate
                      </a>
                    </div>
                  </div>
                )}

                {slide.kind === 'certifications' && (
                  <div className={slideShell}>
                    {slideBackground}
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                          <Award size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white md:text-3xl">{slide.title}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500 md:text-base">{slide.subtitle}</p>
                        </div>
                      </div>
                      <ul className="mt-6 max-h-[min(52vh,420px)] flex-1 space-y-3 overflow-y-auto pr-2 text-left scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {slide.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.06] hover:border-white/10"
                            >
                              <ExternalLink className="mt-0.5 size-5 shrink-0 text-emerald-400/80 group-hover:text-emerald-300" aria-hidden />
                              <span className="text-sm font-medium text-neutral-300 group-hover:text-white md:text-base">
                                {link.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {slide.kind === 'techStack' && (
                  <div className={slideShell}>
                    {slideBackground}
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                          <LayoutTemplate size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white md:text-3xl">{slide.title}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500 md:text-base">{slide.subtitle}</p>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-2.5">
                        {slide.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:-translate-y-1 hover:bg-white/10 hover:text-white md:text-base"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            className="left-3 top-1/2 z-20 size-10 -translate-y-1/2 border-white/10 bg-black/40 text-white backdrop-blur-md hover:bg-white/20 md:-left-16 md:size-12 lg:-left-20"
          />
          <CarouselNext
            variant="outline"
            className="right-3 top-1/2 z-20 size-10 -translate-y-1/2 border-white/10 bg-black/40 text-white backdrop-blur-md hover:bg-white/20 md:-right-16 md:size-12 lg:-right-20"
          />
        </Carousel>

        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Achievement slides">
          {ACHIEVEMENT_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={current === i}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${current === i ? 'w-8 bg-indigo-400' : 'w-2 bg-white/25 hover:bg-white/40'}`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Achievements
