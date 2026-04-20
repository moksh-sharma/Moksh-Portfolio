/** Deloitte / Forage — completion certificate (same for card + button). */
export const DELOITTE_CERTIFICATE_URL =
  'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_5nNToHjpNFu4gLx4T_1751186944085_completion_certificate.pdf'

export type DeloitteSlide = {
  kind: 'deloitte'
  title: string
  subtitle: string
  bullets: string[]
  certificateUrl: string
}

export type CertificationsSlide = {
  kind: 'certifications'
  title: string
  subtitle: string
  links: { label: string; href: string }[]
}

export type TechStackSlide = {
  kind: 'techStack'
  title: string
  subtitle: string
  skills: string[]
}

export type AchievementSlide = DeloitteSlide | CertificationsSlide | TechStackSlide

const TECH_SKILLS_CSV =
  'Python, C++, Java, Object oriented Programming, HTML, CSS, JavaScript, React Js, SQL, Flask, FastAPI, User experience design, Data analysis, MS Excel, Agile methodology, Communication and presentation skills'

export const ACHIEVEMENT_SLIDES: AchievementSlide[] = [
  {
    kind: 'deloitte',
    title: 'Deloitte',
    subtitle: 'Data Analytics - June 2025',
    bullets: [
      'Completed a Deloitte job simulation involving data analysis and forensic technology.',
      'Created a data dashboard using Tableau.',
      'Used Excel to classify data and draw business conclusions.',
    ],
    certificateUrl: DELOITTE_CERTIFICATE_URL,
  },
  {
    kind: 'certifications',
    title: 'Certifications',
    subtitle: '(click to verify)',
    links: [
      { label: 'Google Data Analytics', href: 'https://coursera.org/verify/professional-cert/NCXN3SKF19LJ' },
      { label: 'Project Planning (Google)', href: 'https://coursera.org/verify/OV3IEFHGDWCB' },
      { label: 'Data Visualization', href: 'https://www.coursera.org/account/accomplishments/verify/CTAM5EKCBS76' },
      { label: 'Data Mining', href: 'https://www.coursera.org/account/accomplishments/verify/T69IG1Q4OM1A' },
      { label: 'Operating Systems', href: 'https://www.coursera.org/account/accomplishments/verify/U12YH3ZEW4E6' },
      { label: 'Python Data Structures', href: 'https://coursera.org/share/d303a95bc63d096fa8ae4488c4d0794f' },
      { label: 'Intro to Mordern Database Systems', href: 'https://learn.saylor.org/admin/tool/certificate/index.php?code=9976638648MS' },
      {
        label: 'Generative AI',
        href: 'https://www.linkedin.com/learning/certificates/886dd6143e4081c6226d08c6e7d46c46126bc544dc78db140a2429d6564bea9b',
      },
    ],
  },
  {
    kind: 'techStack',
    title: 'Tech Stack',
    subtitle: '(key skills)',
    skills: TECH_SKILLS_CSV.split(',').map((s) => s.trim()),
  },
]
