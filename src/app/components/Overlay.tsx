import { Github, Linkedin, Mail, ExternalLink, ChevronDown, GraduationCap, Code } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { HeroMonogram } from './HeroMonogram'
import { Experience } from './Experience'
import { RolesSection } from './RolesSection'
import { TypeAnimation } from 'react-type-animation'
import React, { useState, useEffect } from 'react'
import { WORKS } from '../../data/works'
import resumePdfUrl from '../../assets/Moksh Resume.pdf?url'

const workDetailContainerVariants = {
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

const workDetailItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const workDetailTagRowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
}

const LEGAL_NAME = 'Moksh Sharma'

const CONTACT_GITHUB = 'https://github.com/moksh-sharma'
const CONTACT_LINKEDIN = 'https://www.linkedin.com/in/msam1113/'
const CONTACT_EMAIL = 'moksh11072005@gmail.com'
const WHATSAPP_HREF =
  'https://wa.me/9870306895?text=' + encodeURIComponent('Hi, How are you?')

const TECH_BELT_ITEMS = [
  'Python',
  'C++',
  'Java',
  'JavaScript',
  'React.js',
  'Next.js',
  'FastAPI',
  'Flask',
  'SQL',
  'PostgreSQL',
  'Excel',
  'Generative AI',
  'LLMs',
  'Git',
  'REST APIs',
  'Object Oriented Programming',
  'Agile Project Management',
] as const

const TECH_BELT_MARQUEE = `${TECH_BELT_ITEMS.join(' • ')} • `

/** Lenis time-based scroll easing (0–1 → 0–1), used for in-page anchor navigation. */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export function Overlay() {
  const lenis = useLenis()
  const [activeTab, setActiveTab] = useState('Skills')
  const [scrolled, setScrolled] = useState(false)
  const [openWorkId, setOpenWorkId] = useState<string | null>(null)

  useEffect(() => {
    const scrollRoot = () => document.getElementById('portfolio-scroll')

    const handleScroll = () => {
      const el = scrollRoot()
      const top = el ? el.scrollTop : window.scrollY
      setScrolled(top > 50)
    }

    const el = scrollRoot()
    const target: HTMLElement | Window = el ?? window
    target.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => target.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Roles", href: "#roles" },
    { name: "Contact", href: "#contact" }
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return
    const offset =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? -80 : 0
    if (lenis) {
      lenis.scrollTo(el, {
        offset,
        duration: 1.35,
        easing: easeOutCubic,
      })
      return
    }
    const root = document.getElementById('portfolio-scroll')
    if (root) {
      const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop + offset
      root.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex w-full max-w-[100vw] flex-col items-center overflow-x-hidden text-white font-sans pointer-events-none">

      {/* Fixed Nav (tablet/desktop only — hidden on mobile) */}
      <nav
        className={`pointer-events-auto fixed left-0 top-0 z-50 hidden w-full pt-[max(0px,env(safe-area-inset-top))] transition-all duration-300 md:block ${scrolled ? 'border-b border-white/10 bg-black/50 py-3 backdrop-blur-md md:py-4' : 'bg-transparent py-4 md:py-6'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-12">
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="text-lg font-bold tracking-tighter text-white sm:text-xl md:text-xl">
            MS<span className="text-indigo-500">.</span>
          </a>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section
        id="hero"
        className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-start px-5 pb-[max(6.5rem,calc(env(safe-area-inset-bottom,0px)+5.5rem))] pt-[max(1.25rem,env(safe-area-inset-top,0px)+1rem)] sm:px-6 sm:pb-32 sm:pt-10 md:min-h-screen md:justify-center md:px-12 md:py-28 md:pb-32 md:pt-28 lg:px-24 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="z-10 pointer-events-auto flex w-full max-w-full flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-12 md:text-left"
        >
          <div className="flex w-full min-w-0 max-w-lg flex-1 flex-col items-stretch px-0 sm:max-w-xl sm:items-center md:max-w-none md:items-start md:px-0">
            <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur-sm sm:p-4 md:rounded-3xl md:p-6 [&>*]:min-h-0 [&>*]:min-w-0">
              <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-indigo-400 sm:mb-4 sm:text-xs sm:tracking-widest md:text-left md:text-base">
                Hi, my name is
              </p>
              <h1 className="mb-3 text-center text-4xl font-bold uppercase leading-[1.06] tracking-tighter sm:mb-4 sm:text-5xl md:text-left md:text-7xl lg:text-8xl">
                <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">MOKSH</span>
                <span className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">{' '}SHARMA</span>
              </h1>
              <h2 className="mb-5 min-h-[48px] text-center text-2xl font-bold text-neutral-500 sm:mb-6 sm:min-h-[52px] sm:text-3xl md:min-h-[80px] md:text-left md:text-5xl lg:text-6xl">
                <TypeAnimation
                  sequence={[
                    'Data Analysis', 2200,
                    'Web Development', 2200,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400"
                  repeat={Infinity}
                />
              </h2>
              <p className="mx-auto mb-8 w-full max-w-[min(100%,22rem)] text-pretty text-center text-[15px] font-light leading-[1.65] text-neutral-400 sm:mb-10 sm:max-w-none sm:text-lg md:mx-0 md:mb-10 md:text-left md:text-xl">
                I build interactive 3D experiences, scalable web applications, and intuitive user interfaces that live on the modern web.
              </p>
              <div className="mx-auto flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mx-0 md:max-w-none md:justify-start md:gap-6">
                <a
                  href={resumePdfUrl}
                  download="Moksh-Sharma-Resume.pdf"
                  className="min-h-[3rem] w-full touch-manipulation rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98] sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-base md:hover:-translate-y-1 md:hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                >
                  Download Resume
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="min-h-[3rem] w-full touch-manipulation rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.98] sm:min-h-0 sm:w-auto sm:px-8 sm:py-4 sm:text-base md:hover:-translate-y-1"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          <div className="order-first flex w-full max-w-[min(100%,18rem)] shrink-0 items-center justify-center sm:max-w-sm md:order-last md:max-w-md md:flex-1">
            <div className="relative grid aspect-square w-full max-w-full shrink-0 grid-cols-1 grid-rows-1 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur-sm sm:p-4 md:rounded-3xl md:p-6 [&>*]:min-h-0 [&>*]:min-w-0">
              <HeroMonogram />
            </div>
          </div>
        </motion.div>

        {/* Marquee Banner */}
        <div className="pointer-events-none absolute bottom-28 left-[-50%] z-0 w-[200%] overflow-hidden opacity-[0.12] sm:bottom-24 sm:opacity-25 md:bottom-28 md:opacity-30">
          <div
            className="flex w-max animate-[marquee_100s_linear_infinite] whitespace-nowrap font-black text-5xl tracking-tighter text-transparent sm:text-7xl md:text-[10rem]"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
          >
            <span className="inline-block shrink-0 pr-16">{TECH_BELT_MARQUEE}</span>
            <span className="inline-block shrink-0 pr-16">{TECH_BELT_MARQUEE}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px)+0.5rem)] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 animate-bounce motion-reduce:animate-none motion-reduce:opacity-70 sm:bottom-10 sm:gap-2"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll to explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* Section 2: About */}
      <section
        id="about"
        className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-48px' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto z-10 w-full rounded-2xl border border-white/5 bg-black/40 px-4 pb-5 pt-6 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:px-8 sm:pt-8 md:px-12 md:pb-6 md:pt-10"
        >
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:mb-8 sm:text-4xl md:mb-10 md:text-6xl">
            About Me.
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center md:gap-10">
            <div className="flex-1 text-base font-light leading-relaxed text-neutral-300 sm:text-lg">
              <p>
                GenAI and Full Stack Developer with experience in building{' '}
                <strong className="text-white font-medium">AI-powered applications</strong> and{' '}
                <strong className="text-white font-medium">data-driven solutions</strong>. Currently developing scalable systems, focusing on automation, analytics, and intelligent workflows. Strong foundation in{' '}
                <strong className="text-white font-medium">Python</strong>, <strong className="text-white font-medium">SQL</strong>, and modern web technologies, driven by a passion for solving real-world problems.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex-1 w-full">
              <div className="mb-6 flex border-b border-white/10">
                {['Skills', 'Education'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 touch-manipulation py-3 text-sm font-medium transition-colors sm:flex-none sm:px-6 md:text-base ${activeTab === tab ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>

              <div>
                {activeTab === 'Skills' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 gap-2 text-xs font-medium sm:gap-4 sm:text-sm md:grid-cols-3"
                  >
                    {['Python', 'React.js', 'Next.js', 'FastAPI', 'Flask', 'SQL', 'Excel', 'Git', 'REST APIs'].map(skill => (
                      <div
                        key={skill}
                        className="flex min-h-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/5 bg-white/5 p-2 text-center sm:flex-row sm:items-center sm:justify-start sm:gap-2 sm:p-3 sm:text-left"
                      >
                        <Code className="size-3.5 shrink-0 text-indigo-400 sm:size-4" />
                        <span className="max-w-full break-words leading-snug sm:min-w-0">{skill}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'Education' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex shrink-0 self-start rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400 sm:p-3">
                        <GraduationCap className="size-5 sm:size-6" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-balance text-lg font-bold text-white sm:text-xl">
                          B.Tech, Computer Science Engineering
                        </h4>
                        <p className="mt-1 text-xs leading-snug text-indigo-400 sm:text-sm">
                          Bennett University, Times Group, Greater Noida • Aug 2023 – Aug 2027
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex shrink-0 self-start rounded-xl bg-white/5 p-2.5 text-neutral-400 sm:p-3">
                        <GraduationCap className="size-5 sm:size-6" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-balance text-lg font-bold text-white sm:text-xl">Class XII & Class X, CBSE</h4>
                        <p className="mt-1 text-xs leading-snug text-neutral-500 sm:text-sm">
                          DAV Public School, Sector 49, Gurgaon • Apr 2010 – Apr 2023
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Experience />

      {/* Section 4: Latest Works */}
      <section
        id="projects"
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">Latest Works</h2>
          <p className="mx-auto mb-10 max-w-3xl px-1 text-base font-light leading-relaxed text-neutral-400 sm:mb-12 sm:text-lg md:text-xl">
            A selection of projects spanning data tools, web apps, and full-stack development. Click a project to see details.
          </p>
        </motion.div>

        <div className="pointer-events-auto mx-auto flex w-full max-w-4xl flex-col gap-3 px-0 sm:gap-4">
          {WORKS.map((work, i) => {
            const open = openWorkId === work.id
            return (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05, layout: { type: 'spring', bounce: 0.2, duration: 0.45 } }}
                className={`rounded-xl border bg-[#0a0a0a]/80 shadow-xl backdrop-blur-xl transition-colors sm:rounded-2xl ${open ? 'border-indigo-500/40 bg-white/[0.04]' : 'border-white/10 hover:border-white/20'}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`work-panel-${work.id}`}
                  onClick={() => setOpenWorkId(open ? null : work.id)}
                  className="flex w-full touch-manipulation items-start justify-between gap-3 p-4 text-left sm:gap-4 sm:p-5 md:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-balance tracking-tight transition-[font-size,font-weight,color] duration-300 ease-out ${open
                        ? 'bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-xl font-black text-transparent sm:text-2xl md:text-3xl lg:text-4xl'
                        : 'text-lg font-bold text-white sm:text-xl md:text-2xl'
                        }`}
                    >
                      {work.title}
                    </h3>
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
                      id={`work-panel-${work.id}`}
                      role="region"
                      aria-hidden={!open}
                      variants={workDetailContainerVariants}
                      initial={false}
                      animate={open ? 'visible' : 'hidden'}
                      className={`border-t border-white/10 px-4 pb-5 pt-2 sm:px-5 sm:pb-6 md:px-6 ${open ? '' : 'pointer-events-none'}`}
                    >
                      <motion.p
                        variants={workDetailItemVariants}
                        className="text-[15px] font-light leading-relaxed text-neutral-300 sm:text-base"
                      >
                        {work.description}
                      </motion.p>
                      <motion.div variants={workDetailTagRowVariants} className="mt-5 flex flex-wrap gap-2">
                        {work.tags.map((tag, ti) => (
                          <motion.span
                            key={`${work.id}-tag-${ti}`}
                            variants={workDetailItemVariants}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                      <motion.div variants={workDetailItemVariants} className="mt-6">
                        <a
                          href={work.primaryHref}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={open ? undefined : -1}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-200 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-100 sm:min-h-0 sm:px-5"
                        >
                          {work.primaryLabel === 'GitHub' ? <Github size={18} /> : <ExternalLink size={18} />}
                          {work.primaryLabel}
                        </a>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <RolesSection />

      {/* Achievements section omitted for now */}

      {/* Section 6: Contact */}
      <section
        id="contact"
        className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-24 md:px-12 md:py-28 lg:px-24 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pointer-events-auto z-10 w-full max-w-4xl rounded-2xl border border-white/5 bg-black/30 p-6 shadow-2xl backdrop-blur-md sm:rounded-[2.5rem] sm:p-10 md:rounded-[3rem] md:p-16 lg:p-20"
        >
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 sm:mb-4 sm:text-xs">
            GET IN TOUCH
          </h2>
          <h3 className="mb-6 bg-gradient-to-b from-white via-white to-neutral-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:mb-8 sm:text-4xl md:text-6xl lg:text-8xl">
            Let&apos;s build <br className="hidden sm:block" /> together.
          </h3>
          <p className="mx-auto mb-10 max-w-2xl px-1 text-base font-light leading-relaxed text-neutral-400 sm:mb-12 sm:text-lg md:text-2xl">
            Currently open for new opportunities. Whether you have a project in mind or just want to say hello, my inbox is always open.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 md:gap-8">
            <a
              href={CONTACT_GITHUB}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="group touch-manipulation rounded-full border border-white/10 bg-white/5 p-4 text-white transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 sm:p-5 md:p-6 md:hover:-translate-y-2"
            >
              <Github className="size-6 transition-transform group-hover:scale-110 sm:size-7 md:size-[28px]" />
            </a>
            <a
              href={CONTACT_LINKEDIN}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="group touch-manipulation rounded-full border border-white/10 bg-white/5 p-4 text-white transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-95 sm:p-5 md:p-6 md:hover:-translate-y-2"
            >
              <Linkedin className="size-6 transition-transform group-hover:scale-110 sm:size-7 md:size-[28px]" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="group touch-manipulation rounded-full border border-white/10 bg-white/5 p-4 text-white transition-all duration-300 hover:border-emerald-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] active:scale-95 sm:p-5 md:p-6 md:hover:-translate-y-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6 transition-transform group-hover:scale-110 sm:size-7 md:size-7"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              className="group touch-manipulation rounded-full border border-white/10 bg-white/5 p-4 text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 sm:p-5 md:p-6 md:hover:-translate-y-2"
            >
              <Mail className="size-6 transition-transform group-hover:scale-110 sm:size-7 md:size-[28px]" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-5 border-t border-white/5 bg-black/50 backdrop-blur-md pointer-events-auto">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs font-light tracking-wide text-neutral-600 sm:flex-row sm:gap-6 sm:px-6 sm:text-sm md:px-12">
          <p className="text-center md:text-left order-2 md:order-1">
            Made with ❤️ © {new Date().getFullYear()} {LEGAL_NAME}.
          </p>
          <div className="relative grid aspect-square w-full max-w-[min(100%,44px)] shrink-0 grid-cols-1 grid-rows-1 overflow-hidden rounded-md border border-white/10 bg-black/20 p-1 backdrop-blur-sm [&>*]:min-h-0 [&>*]:min-w-0 order-1 md:order-2 md:shrink-0">
            <HeroMonogram compact />
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
